package main

import (
	"log"
	"net/http"

	"perpetual-dex/backend/api"
	"perpetual-dex/backend/db"
)

func main() {
	// Initialize database
	if err := db.Initialize(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	// Create handlers
	orderHandler := api.NewOrderHandler()

	// Set up routes
	http.HandleFunc("/api/orders/create", orderHandler.CreateOrder)
	http.HandleFunc("/api/orders/get", orderHandler.GetOrderByID)
	http.HandleFunc("/api/orders/user", orderHandler.GetUserOrders)

	// Add health check endpoint
	http.HandleFunc("/healthz", api.HealthCheck)

	// Add default route
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Perpetual DEX API"))
	})

	// Start server
	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
