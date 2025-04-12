#!/bin/bash

# Navigate to the frontend directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing dependencies..."
npm install

# Create favicon.ico and logo files
echo "Creating placeholder images..."
touch public/favicon.ico
touch public/logo192.png
touch public/logo512.png

echo "Setup complete. You can now run 'npm start' to start the development server." 