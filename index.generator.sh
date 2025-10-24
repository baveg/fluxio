#!/bin/bash

# Function to generate index.ts for a given directory
generate_index() {
  local dir="$1"
  local index_file="$dir/index.ts"

  # Clear or create the index.ts file
  echo "" > "$index_file"

  # Process all TypeScript files in the directory
  for file in "$dir"/*.ts; do
    [ -e "$file" ] || continue  # Skip if no .ts files exist

    filename=$(basename "$file")

    # Skip index.ts and spec files
    if [[ "$filename" != "index.ts" && "$filename" != *.spec.ts ]]; then
      module_name="${filename%.ts}"
      echo "export * from './$module_name';" >> "$index_file"
    fi
  done

  # Process all subdirectories
  for subdir in "$dir"/*; do
    if [ -d "$subdir" ]; then
      dirname=$(basename "$subdir")
      echo "export * from './$dirname';" >> "$index_file"

      # Recursively generate index.ts for subdirectory
      generate_index "$subdir"
    fi
  done
}

# Start from the src directory
SRC_DIR="$(dirname "$0")/src"

if [ -d "$SRC_DIR" ]; then
  generate_index "$SRC_DIR"
  echo "Index files generated successfully!"
else
  echo "Error: src directory not found at $SRC_DIR"
  exit 1
fi