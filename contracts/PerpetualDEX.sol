// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PerpetualDEX
 * @dev A simplified perpetual DEX contract
 */
contract PerpetualDEX is Ownable, ReentrancyGuard {
    // Token used for collateral (e.g., USDC)
    IERC20 public collateralToken;
    
    // Fee configuration
    uint256 public tradingFeeRate = 5; // 0.05%
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Insurance fund
    uint256 public insuranceFundBalance;
    
    // Market configuration
    struct Market {
        bool isActive;
        uint256 minLeverage;
        uint256 maxLeverage;
        uint256 liquidationThreshold; // e.g., 9000 = 90.00%
        uint256 openInterestLong;
        uint256 openInterestShort;
    }
    
    // Position struct
    struct Position {
        uint256 size;
        uint256 collateral;
        uint256 entryPrice;
        uint256 leverage;
        bool isLong;
        uint256 lastFundingTimestamp;
        int256 fundingPayments;
    }
    
    // Market data storage
    mapping(bytes32 => Market) public markets;
    bytes32[] public marketSymbols;
    
    // User positions: user address => market symbol => Position
    mapping(address => mapping(bytes32 => Position)) public positions;
    
    // Oracle prices (in a production system, these would come from an oracle)
    mapping(bytes32 => uint256) public oraclePrices;
    
    // Funding rates: market symbol => funding rate
    mapping(bytes32 => int256) public fundingRates; // Scaled by 10^6
    
    // Events
    event MarketAdded(bytes32 indexed symbol, uint256 minLeverage, uint256 maxLeverage, uint256 liquidationThreshold);
    event PositionOpened(address indexed trader, bytes32 indexed symbol, uint256 size, uint256 collateral, uint256 leverage, bool isLong, uint256 entryPrice);
    event PositionClosed(address indexed trader, bytes32 indexed symbol, uint256 size, uint256 pnl);
    event PositionLiquidated(address indexed trader, bytes32 indexed symbol, uint256 size, uint256 collateral);
    event FundingPaid(address indexed trader, bytes32 indexed symbol, int256 amount);
    
    /**
     * @dev Constructor
     * @param _collateralToken Address of the token used for collateral
     */
    constructor(address _collateralToken) {
        collateralToken = IERC20(_collateralToken);
    }
    
    /**
     * @dev Add a new market
     * @param _symbol Market symbol (e.g., "BTC-USD")
     * @param _minLeverage Minimum allowed leverage
     * @param _maxLeverage Maximum allowed leverage
     * @param _liquidationThreshold Threshold for liquidation (percentage)
     */
    function addMarket(
        bytes32 _symbol,
        uint256 _minLeverage,
        uint256 _maxLeverage,
        uint256 _liquidationThreshold
    ) external onlyOwner {
        require(!markets[_symbol].isActive, "Market already exists");
        require(_minLeverage > 0, "Min leverage must be > 0");
        require(_maxLeverage >= _minLeverage, "Max leverage must be >= min");
        require(_liquidationThreshold > 0 && _liquidationThreshold < 10000, "Invalid liquidation threshold");
        
        markets[_symbol] = Market({
            isActive: true,
            minLeverage: _minLeverage,
            maxLeverage: _maxLeverage,
            liquidationThreshold: _liquidationThreshold,
            openInterestLong: 0,
            openInterestShort: 0
        });
        
        marketSymbols.push(_symbol);
        
        emit MarketAdded(_symbol, _minLeverage, _maxLeverage, _liquidationThreshold);
    }
    
    /**
     * @dev Set oracle price for a market
     * @param _symbol Market symbol
     * @param _price New price
     */
    function setOraclePrice(bytes32 _symbol, uint256 _price) external onlyOwner {
        require(markets[_symbol].isActive, "Market not active");
        require(_price > 0, "Price must be > 0");
        
        oraclePrices[_symbol] = _price;
    }
    
    /**
     * @dev Set funding rate for a market
     * @param _symbol Market symbol
     * @param _fundingRate New funding rate (can be negative)
     */
    function setFundingRate(bytes32 _symbol, int256 _fundingRate) external onlyOwner {
        require(markets[_symbol].isActive, "Market not active");
        
        fundingRates[_symbol] = _fundingRate;
    }
    
    /**
     * @dev Open a position
     * @param _symbol Market symbol
     * @param _collateralAmount Amount of collateral to deposit
     * @param _leverage Leverage to use
     * @param _isLong Whether the position is long or short
     */
    function openPosition(
        bytes32 _symbol,
        uint256 _collateralAmount,
        uint256 _leverage,
        bool _isLong
    ) external nonReentrant {
        Market storage market = markets[_symbol];
        require(market.isActive, "Market not active");
        require(_leverage >= market.minLeverage && _leverage <= market.maxLeverage, "Invalid leverage");
        require(_collateralAmount > 0, "Collateral must be > 0");
        require(positions[msg.sender][_symbol].size == 0, "Position already exists");
        
        uint256 oraclePrice = oraclePrices[_symbol];
        require(oraclePrice > 0, "Invalid oracle price");
        
        // Calculate position size
        uint256 size = _collateralAmount * _leverage;
        
        // Transfer collateral from user to contract
        require(collateralToken.transferFrom(msg.sender, address(this), _collateralAmount), "Collateral transfer failed");
        
        // Create position
        positions[msg.sender][_symbol] = Position({
            size: size,
            collateral: _collateralAmount,
            entryPrice: oraclePrice,
            leverage: _leverage,
            isLong: _isLong,
            lastFundingTimestamp: block.timestamp,
            fundingPayments: 0
        });
        
        // Update open interest
        if (_isLong) {
            market.openInterestLong += size;
        } else {
            market.openInterestShort += size;
        }
        
        emit PositionOpened(msg.sender, _symbol, size, _collateralAmount, _leverage, _isLong, oraclePrice);
    }
    
    /**
     * @dev Close a position
     * @param _symbol Market symbol
     */
    function closePosition(bytes32 _symbol) external nonReentrant {
        Position storage position = positions[msg.sender][_symbol];
        require(position.size > 0, "No position found");
        
        Market storage market = markets[_symbol];
        require(market.isActive, "Market not active");
        
        uint256 oraclePrice = oraclePrices[_symbol];
        require(oraclePrice > 0, "Invalid oracle price");
        
        // Apply funding payments
        _applyFunding(msg.sender, _symbol);
        
        // Calculate PnL
        int256 pnl = _calculatePnL(position, oraclePrice);
        
        // Calculate trading fee
        uint256 tradingFee = (position.size * tradingFeeRate) / FEE_DENOMINATOR;
        
        // Update open interest
        if (position.isLong) {
            market.openInterestLong -= position.size;
        } else {
            market.openInterestShort -= position.size;
        }
        
        // Calculate amount to return to user
        uint256 returnAmount;
        if (pnl > 0) {
            returnAmount = position.collateral + uint256(pnl) - tradingFee;
        } else {
            returnAmount = position.collateral > uint256(-pnl) ? position.collateral - uint256(-pnl) - tradingFee : 0;
        }
        
        // Add fee to insurance fund
        insuranceFundBalance += tradingFee;
        
        // Clear position
        uint256 positionSize = position.size;
        delete positions[msg.sender][_symbol];
        
        // Transfer funds back to user
        if (returnAmount > 0) {
            require(collateralToken.transfer(msg.sender, returnAmount), "Token transfer failed");
        }
        
        emit PositionClosed(msg.sender, _symbol, positionSize, returnAmount > position.collateral ? returnAmount - position.collateral : 0);
    }
    
    /**
     * @dev Liquidate a position if it's below liquidation threshold
     * @param _trader Address of the trader
     * @param _symbol Market symbol
     */
    function liquidatePosition(address _trader, bytes32 _symbol) external nonReentrant {
        Position storage position = positions[_trader][_symbol];
        require(position.size > 0, "No position found");
        
        Market storage market = markets[_symbol];
        require(market.isActive, "Market not active");
        
        uint256 oraclePrice = oraclePrices[_symbol];
        require(oraclePrice > 0, "Invalid oracle price");
        
        // Apply funding payments
        _applyFunding(_trader, _symbol);
        
        // Calculate current position value
        int256 pnl = _calculatePnL(position, oraclePrice);
        
        // Check if position is eligible for liquidation
        uint256 liquidationThreshold = (position.collateral * market.liquidationThreshold) / 10000;
        require(pnl < 0 && uint256(-pnl) > liquidationThreshold, "Position not liquidatable");
        
        // Update open interest
        if (position.isLong) {
            market.openInterestLong -= position.size;
        } else {
            market.openInterestShort -= position.size;
        }
        
        // Send remaining collateral (if any) to insurance fund
        uint256 remainingCollateral = position.collateral > uint256(-pnl) ? position.collateral - uint256(-pnl) : 0;
        insuranceFundBalance += remainingCollateral;
        
        // Clear position
        uint256 positionSize = position.size;
        uint256 collateralAmount = position.collateral;
        delete positions[_trader][_symbol];
        
        emit PositionLiquidated(_trader, _symbol, positionSize, collateralAmount);
    }
    
    /**
     * @dev Apply funding payments to a position
     * @param _trader Trader address
     * @param _symbol Market symbol
     */
    function _applyFunding(address _trader, bytes32 _symbol) internal {
        Position storage position = positions[_trader][_symbol];
        if (position.size == 0) {
            return;
        }
        
        // Calculate funding payment
        int256 fundingRate = fundingRates[_symbol];
        uint256 timeDelta = block.timestamp - position.lastFundingTimestamp;
        
        // Funding is paid per day (86400 seconds)
        int256 fundingPayment = int256(position.size) * fundingRate * int256(timeDelta) / int256(86400 * 10**6);
        
        // Long positions pay positive funding rates, shorts receive
        if (position.isLong) {
            position.fundingPayments -= fundingPayment;
        } else {
            position.fundingPayments += fundingPayment;
        }
        
        position.lastFundingTimestamp = block.timestamp;
        
        emit FundingPaid(_trader, _symbol, fundingPayment);
    }
    
    /**
     * @dev Calculate PnL for a position
     * @param _position Position struct
     * @param _currentPrice Current price
     * @return int256 PnL amount (positive for profit, negative for loss)
     */
    function _calculatePnL(Position storage _position, uint256 _currentPrice) internal view returns (int256) {
        if (_position.isLong) {
            // Long position: (currentPrice - entryPrice) * size / entryPrice
            if (_currentPrice > _position.entryPrice) {
                return int256((_currentPrice - _position.entryPrice) * _position.size / _position.entryPrice) + _position.fundingPayments;
            } else {
                return -int256((_position.entryPrice - _currentPrice) * _position.size / _position.entryPrice) + _position.fundingPayments;
            }
        } else {
            // Short position: (entryPrice - currentPrice) * size / entryPrice
            if (_position.entryPrice > _currentPrice) {
                return int256((_position.entryPrice - _currentPrice) * _position.size / _position.entryPrice) + _position.fundingPayments;
            } else {
                return -int256((_currentPrice - _position.entryPrice) * _position.size / _position.entryPrice) + _position.fundingPayments;
            }
        }
    }
    
    /**
     * @dev Get position details
     * @param _trader Trader address
     * @param _symbol Market symbol
     * @return Position struct details
     */
    function getPosition(address _trader, bytes32 _symbol) external view returns (
        uint256 size,
        uint256 collateral,
        uint256 entryPrice,
        uint256 leverage,
        bool isLong,
        int256 unrealizedPnl
    ) {
        Position storage position = positions[_trader][_symbol];
        require(position.size > 0, "No position found");
        
        uint256 oraclePrice = oraclePrices[_symbol];
        require(oraclePrice > 0, "Invalid oracle price");
        
        // Calculate PnL at current prices (without applying funding)
        int256 pnl = _calculatePnL(position, oraclePrice);
        
        return (
            position.size,
            position.collateral,
            position.entryPrice,
            position.leverage,
            position.isLong,
            pnl
        );
    }
} 