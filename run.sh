#!/bin/bash

# Navigate to the working directory
cd "$(dirname "$0")"

# Check if the server binary exists
if [ ! -f "./dex-server" ]; then
    echo "Building server..."
    go build -o dex-server
fi

# Run the server
echo "Starting server..."
./dex-server 