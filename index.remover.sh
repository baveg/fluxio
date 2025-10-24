#!/bin/bash

# Script to remove all index.ts files in src directory recursively

SRC_DIR="$(dirname "$0")/src"

if [ ! -d "$SRC_DIR" ]; then
  echo "Error: src directory not found at $SRC_DIR"
  exit 1
fi

echo "Searching for index.ts files in $SRC_DIR..."

# Find and count index.ts files
file_count=$(find "$SRC_DIR" -name "index.ts" -type f | wc -l)

if [ "$file_count" -eq 0 ]; then
  echo "No index.ts files found."
  exit 0
fi

echo "Found $file_count index.ts file(s)."
echo ""
echo "Files to be deleted:"
find "$SRC_DIR" -name "index.ts" -type f

echo ""
read -p "Are you sure you want to delete these files? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  find "$SRC_DIR" -name "index.ts" -type f -delete
  echo "✓ All index.ts files have been deleted successfully!"
else
  echo "Operation cancelled."
  exit 0
fi
