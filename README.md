# Perpetual DEX Project

A microservices-based perpetual decentralized exchange (DEX) with a Go backend and React frontend.

## Architecture

This project implements a perpetual DEX with the following components:

### Backend (Go)
- RESTful API for order management, user positions, and market data
- Interfaces with a PostgreSQL database for persistent storage
- Uses Redis for caching and real-time data
- Structured as microservices for scalability

### Frontend (React/TypeScript)
- Modern, responsive UI with React
- Price charts using Lightweight Charts
- Order entry and management interface
- Position monitoring and PnL tracking

### Smart Contracts (Solidity)
- Perpetual swap contract for on-chain trading
- Funding rate mechanism
- Liquidation engine
- Insurance fund management

## Features

- Leverage trading (up to 100x)
- Long and short positions
- Market and limit orders
- Real-time price feeds
- Position management
- Funding rate calculations
- Risk management and liquidations

## TradFi Concepts to Understand

1. **Margin Trading**: Trading with borrowed funds to amplify potential returns.
2. **Perpetual Swaps**: Futures contracts with no expiry date.
3. **Funding Rates**: Periodic payments between longs and shorts to keep perpetual futures prices aligned with the spot market.
4. **Mark Price**: The price used for calculations like liquidations, often using a time-weighted average to prevent manipulation.
5. **Liquidation Mechanisms**: Process of closing positions when they fall below maintenance margin requirements.
6. **Insurance Fund**: Pool used to cover shortfalls from underwater liquidations.
7. **Order Book vs AMM**: Different matching mechanisms for trades.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Go 1.19+
- Node.js 16+
- PostgreSQL 14+
- Redis

### Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/perpetual-dex.git
   cd perpetual-dex
   ```

2. Fix import paths (if needed):
   ```
   # Update all import paths from "working/backend/..." to "perpetual-dex/backend/..."
   ```

3. Set up environment variables:
   ```
   # Create a .env file or use the provided one
   cp .env.example .env
   ```

4. Start the development environment:
   Option 1: Using Docker Compose
   ```
   cd docker
   docker-compose up
   ```
   
   Option 2: Running components individually
   ```
   # Start database
   docker run -d --name postgres -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=perpetual_dex postgres:14
   
   # Run the backend
   ./scripts/run.sh backend
   
   # Run the frontend
   cd frontend && npm install && npm start
   ```

5. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Health check: http://localhost:8080/healthz

6. Testing the API:
   ```bash
   # Create an order
   curl -X POST http://localhost:8080/api/orders/create \
     -H "Content-Type: application/json" \
     -d '{"userId":"user123","symbol":"BTC-USDT","side":"buy","size":1,"price":50000,"type":"limit","leverage":10}'

   # Get an order
   curl http://localhost:8080/api/orders/get?id=your-order-id

   # Get user orders
   curl http://localhost:8080/api/orders/user?userId=user123
   ```

## Microservices Architecture

The DEX is built using microservices:

1. **Auth Service**: User authentication and authorization
2. **Order Service**: Order processing and matching
3. **Position Service**: Position management and risk calculations
4. **Market Data Service**: Price feeds and market information
5. **Liquidation Service**: Monitoring positions for liquidation
6. **Funding Rate Service**: Calculating and applying funding rates

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Lightweight Charts
- **Backend**: Go, Gin Web Framework
- **Databases**: PostgreSQL, Redis, TimescaleDB
- **Message Queue**: Kafka
- **Infrastructure**: Docker, Kubernetes, AWS
- **Smart Contracts**: Solidity, Hardhat
- **CI/CD**: GitHub Actions

## Troubleshooting

- **Import Issues**: Ensure all imports use the correct module name ("perpetual-dex/backend/...")
- **Database Errors**: Check that PostgreSQL is running and accessible
- **Frontend Errors**: Ensure Node.js is properly installed and npm can find the dependencies

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 