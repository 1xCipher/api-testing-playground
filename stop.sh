#!/bin/bash

echo "Stopping API Testing Playground servers..."

# Find and kill node processes related to this project
pkill -f "node --watch server/index.js"
pkill -f "vite"

echo "All servers stopped."
