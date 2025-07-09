#!/bin/bash

# Clean installation script for Render deployment

echo "Starting clean build process..."

# Navigate to client directory
cd client

# Remove node_modules and package-lock if they exist
echo "Cleaning client dependencies..."
rm -rf node_modules package-lock.json

# Install client dependencies
echo "Installing client dependencies..."
npm install

# Build the client
echo "Building client..."
npm run build

# Navigate to server directory
cd ../server

# Remove node_modules and package-lock if they exist
echo "Cleaning server dependencies..."
rm -rf node_modules package-lock.json

# Install server dependencies
echo "Installing server dependencies..."
npm install

echo "Build complete!"