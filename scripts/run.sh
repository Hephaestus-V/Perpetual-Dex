#!/bin/bash

# Create PostgreSQL database if it doesn't exist
create_database() {
    PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -U ${DB_USER} -p ${DB_PORT} -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || \
    PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -U ${DB_USER} -p ${DB_PORT} -c "CREATE DATABASE ${DB_NAME}"
    
    echo "Database setup complete"
}

# Run the backend server
run_backend() {
    echo "Starting backend server..."
    cd backend
    go run ../main.go
}

# Run using Docker Compose
run_docker() {
    echo "Starting services with Docker Compose..."
    cd docker
    docker-compose up
}

# Show help
show_help() {
    echo "Usage: ./run.sh [option]"
    echo "Options:"
    echo "  backend   - Run the backend server"
    echo "  docker    - Run all services with Docker Compose"
    echo "  db-setup  - Set up the database"
    echo "  help      - Show this help message"
}

# Set default environment variables if not set
export DB_HOST=${DB_HOST:-localhost}
export DB_PORT=${DB_PORT:-5432}
export DB_USER=${DB_USER:-postgres}
export DB_PASSWORD=${DB_PASSWORD:-postgres}
export DB_NAME=${DB_NAME:-perpetual_dex}

# Process command line arguments
case "$1" in
    backend)
        run_backend
        ;;
    docker)
        run_docker
        ;;
    db-setup)
        create_database
        ;;
    help|*)
        show_help
        ;;
esac 