package api

import (
	"encoding/json"
	"net/http"
	"time"

	"perpetual-dex/backend/db"
)

// HealthResponse represents the health check response
type HealthResponse struct {
	Status    string `json:"status"`
	Timestamp string `json:"timestamp"`
	DBStatus  string `json:"dbStatus"`
}

// HealthCheck handles the health check endpoint
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Check database connection
	dbStatus := "up"
	if db.DB == nil {
		dbStatus = "down"
	} else if err := db.DB.Ping(); err != nil {
		dbStatus = "down"
	}

	// Create response
	response := HealthResponse{
		Status:    "ok",
		Timestamp: time.Now().Format(time.RFC3339),
		DBStatus:  dbStatus,
	}

	// Return response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
