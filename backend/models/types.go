package models

import (
	"time"
)

// Order represents a trading order
type Order struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId"`
	Symbol    string    `json:"symbol"`
	Side      string    `json:"side"` // "buy" or "sell"
	Size      float64   `json:"size"`
	Price     float64   `json:"price"`
	Leverage  int       `json:"leverage"`
	Type      string    `json:"type"` // "market" or "limit"
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// Position represents a user's open position
type Position struct {
	ID               string    `json:"id"`
	UserID           string    `json:"userId"`
	Symbol           string    `json:"symbol"`
	Side             string    `json:"side"` // "long" or "short"
	Size             float64   `json:"size"`
	EntryPrice       float64   `json:"entryPrice"`
	Leverage         int       `json:"leverage"`
	LiquidationPrice float64   `json:"liquidationPrice"`
	UnrealizedPnL    float64   `json:"unrealizedPnl"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

// Market represents a trading pair
type Market struct {
	Symbol       string  `json:"symbol"`
	BaseAsset    string  `json:"baseAsset"`
	QuoteAsset   string  `json:"quoteAsset"`
	IndexPrice   float64 `json:"indexPrice"`
	MarkPrice    float64 `json:"markPrice"`
	FundingRate  float64 `json:"fundingRate"`
	Volume24h    float64 `json:"volume24h"`
	OpenInterest float64 `json:"openInterest"`
}

// User represents a user account
type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Balance   float64   `json:"balance"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
