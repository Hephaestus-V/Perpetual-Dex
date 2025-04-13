package services

import (
	"errors"
	"log"
	"time"

	"github.com/google/uuid"

	"perpetual-dex/backend/models"
)

// OrderService handles order operations
type OrderService struct{}

// CreateOrder creates a new order
func (s *OrderService) CreateOrder(userID, symbol, side, orderType string, size, price float64, leverage int) (*models.Order, error) {
	// Validate order
	if size <= 0 {
		return nil, errors.New("order size must be positive")
	}

	if side != "buy" && side != "sell" {
		return nil, errors.New("side must be buy or sell")
	}

	if orderType != "market" && orderType != "limit" {
		return nil, errors.New("order type must be market or limit")
	}

	// Create order
	order := &models.Order{
		ID:        uuid.New().String(),
		UserID:    userID,
		Symbol:    symbol,
		Side:      side,
		Size:      size,
		Price:     price,
		Leverage:  leverage,
		Type:      orderType,
		Status:    "pending",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// TODO: Save order to database
	// For now, just log it
	log.Printf("Created order: %+v", order)

	// TODO: Match order with orderbook
	// For now, just mark as filled
	order.Status = "filled"

	// TODO: Create position if order is filled
	// This would call the position service

	return order, nil
}

// GetOrderByID retrieves an order by ID
func (s *OrderService) GetOrderByID(orderID string) (*models.Order, error) {
	// TODO: Query database for order
	// For now, return a mock
	if orderID == "" {
		return nil, errors.New("order ID cannot be empty")
	}

	// Mock order
	return &models.Order{
		ID:        orderID,
		UserID:    "user123",
		Symbol:    "BTC-PERP",
		Side:      "buy",
		Size:      1.0,
		Price:     50000.0,
		Leverage:  10,
		Type:      "limit",
		Status:    "filled",
		CreatedAt: time.Now().Add(-1 * time.Hour),
		UpdatedAt: time.Now(),
	}, nil
}

// GetOrdersByUserID retrieves orders for a user
func (s *OrderService) GetOrdersByUserID(userID string) ([]*models.Order, error) {
	// TODO: Query database for user's orders
	// For now, return mock data
	if userID == "" {
		return nil, errors.New("user ID cannot be empty")
	}

	// Mock orders
	return []*models.Order{
		{
			ID:        uuid.New().String(),
			UserID:    userID,
			Symbol:    "BTC-PERP",
			Side:      "buy",
			Size:      1.0,
			Price:     50000.0,
			Leverage:  10,
			Type:      "limit",
			Status:    "filled",
			CreatedAt: time.Now().Add(-1 * time.Hour),
			UpdatedAt: time.Now(),
		},
		{
			ID:        uuid.New().String(),
			UserID:    userID,
			Symbol:    "ETH-USDT",
			Side:      "sell",
			Size:      5.0,
			Price:     3000.0,
			Leverage:  5,
			Type:      "market",
			Status:    "filled",
			CreatedAt: time.Now().Add(-2 * time.Hour),
			UpdatedAt: time.Now(),
		},
	}, nil
}
