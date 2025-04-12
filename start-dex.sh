#!/bin/bash

# Navigate to the working directory
cd "$(dirname "$0")"

# Start the backend server
./run.sh

# If you want to start both backend and frontend, uncomment these lines
# echo "Starting frontend server..."
# cd frontend
# npm start 