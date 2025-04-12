# Perpetual DEX Setup Instructions

This document provides detailed instructions for setting up and running the Perpetual DEX project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Go** (v1.19+)
- **Node.js** (v16+)
- **npm** (usually comes with Node.js)
- **PostgreSQL** (v14+)
- **Docker** and **Docker Compose** (optional, for containerized setup)

## Quick Start

For the fastest way to get started, use our launcher script from the root directory:

```bash
./startDEX.sh
```

This script:
1. Starts the Go backend server
2. Installs npm dependencies if needed
3. Starts the React development server
4. Creates any missing placeholder files

To start only the backend or frontend:

```bash
./startDEX.sh backend   # Start only the backend
./startDEX.sh frontend  # Start only the frontend
```

## Manual Setup

### Backend Setup

1. **Navigate to the working directory**
   ```bash
   cd working
   ```

2. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit the .env file with your database credentials
   nano .env
   ```

3. **Build the Go server**
   ```bash
   go build -o dex-server
   ```

4. **Run the server**
   ```bash
   ./dex-server
   ```

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd working/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## Using Docker (Optional)

For a containerized setup, you can use Docker Compose:

```bash
cd working/docker
docker-compose up
```

This will start the following services:
- Frontend (React)
- Backend (Go)
- PostgreSQL database
- Redis cache

## Testing the API

You can test the API using curl:

```bash
# Health check
curl http://localhost:8080/healthz

# Create an order
curl -X POST http://localhost:8080/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","symbol":"BTC-USDT","side":"buy","size":1,"price":50000,"type":"limit","leverage":10}'

# Get user orders
curl http://localhost:8080/api/orders/user?userId=user123
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in .env file
   - Try connecting to the database manually to verify connection

2. **Frontend Build Errors**
   - Check for missing dependencies: `npm install`
   - Ensure all required files exist
   - Try clearing node_modules and reinstalling: `rm -rf node_modules && npm install`

3. **Backend Build Errors**
   - Ensure Go is properly installed
   - Check that all import paths use the correct module name: `perpetual-dex/backend/...`
   - Run `go mod tidy` to fix dependency issues

4. **"Command not found" Errors**
   - Ensure script files have execute permissions: `chmod +x *.sh`
   - Verify you're running commands from the correct directory

### Getting Help

If you continue to experience issues, please check the detailed logs:

```bash
# Backend logs
./run.sh 2>&1 | tee backend-logs.txt

# Frontend logs
cd frontend && npm start 2>&1 | tee ../frontend-logs.txt
``` 