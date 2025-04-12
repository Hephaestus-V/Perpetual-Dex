package api

import (
	"encoding/json"
	"net/http"

	"perpetual-dex/backend/services"
)

// OrderHandler handles order-related API requests
type OrderHandler struct {
	orderService *services.OrderService
}

// NewOrderHandler creates a new order handler
func NewOrderHandler() *OrderHandler {
	return &OrderHandler{
		orderService: &services.OrderService{},
	}
}

// CreateOrderRequest represents the request to create an order
type CreateOrderRequest struct {
	UserID   string  `json:"userId"`
	Symbol   string  `json:"symbol"`
	Side     string  `json:"side"`
	Size     float64 `json:"size"`
	Price    float64 `json:"price"`
	Type     string  `json:"type"`
	Leverage int     `json:"leverage"`
}

// CreateOrder handles the creation of a new order
func (h *OrderHandler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CreateOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	order, err := h.orderService.CreateOrder(
		req.UserID,
		req.Symbol,
		req.Side,
		req.Type,
		req.Size,
		req.Price,
		req.Leverage,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(order)
}

// GetOrderByID handles fetching an order by ID
func (h *OrderHandler) GetOrderByID(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	orderID := r.URL.Query().Get("id")
	if orderID == "" {
		http.Error(w, "Order ID is required", http.StatusBadRequest)
		return
	}

	order, err := h.orderService.GetOrderByID(orderID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(order)
}

// GetUserOrders handles fetching all orders for a user
func (h *OrderHandler) GetUserOrders(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.URL.Query().Get("userId")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	orders, err := h.orderService.GetOrdersByUserID(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}
