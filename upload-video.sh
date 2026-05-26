#!/bin/bash
# Direct video upload script for PamliEcoConnect
# Usage: ./upload-video.sh <path-to-video-file> <title> <excerpt>
# Example: ./upload-video.sh my-video.mp4 "My Video" "This is a description"

set -e

if [ $# -lt 3 ]; then
    echo "Usage: $0 <video-file> <title> <excerpt>"
    echo "Example: $0 my-video.mp4 \"My Video Title\" \"My description\""
    exit 1
fi

VIDEO_FILE="$1"
TITLE="$2"
EXCERPT="$3"

# Check file exists
if [ ! -f "$VIDEO_FILE" ]; then
    echo "Error: File '$VIDEO_FILE' not found"
    exit 1
fi

# Get file size
FILE_SIZE=$(stat -f%z "$VIDEO_FILE" 2>/dev/null || stat -c%s "$VIDEO_FILE" 2>/dev/null)
echo "Uploading: $VIDEO_FILE ($((FILE_SIZE / 1024 / 1024))MB)"

# Generate UUID for the file
FILE_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
UPLOAD_DIR="/home/ca12a15/sites/sailhatteras_site/uploads/uploads"

# Create directory if needed
mkdir -p "$UPLOAD_DIR"

# Copy file directly to upload directory
echo "Saving file to: $UPLOAD_DIR/$FILE_ID"
cp "$VIDEO_FILE" "$UPLOAD_DIR/$FILE_ID"

# Verify it was copied
if [ ! -f "$UPLOAD_DIR/$FILE_ID" ]; then
    echo "Error: Failed to copy file"
    exit 1
fi

echo "✓ File saved successfully"

# Get database connection details
DB_HOST="127.0.0.1"
DB_USER="sailhatteras_app"
DB_PASS="gYi4HQwQqpE40bEyWkzvhDhw"
DB_NAME="sailhatteras"

# Create post in database
MEDIA_URL="/media/$FILE_ID"
echo "Creating post in database..."

POST_ID=$(psql "postgresql://$DB_USER:$DB_PASS@$DB_HOST:5432/$DB_NAME" -tc \
  "INSERT INTO posts (title, excerpt, content, type, media_url, featured, published_at, created_at) 
   VALUES ('$TITLE', '$EXCERPT', '$EXCERPT', 'video', '$MEDIA_URL', false, NOW(), NOW()) 
   RETURNING id;" | xargs)

if [ -z "$POST_ID" ]; then
    echo "Error: Failed to create post in database"
    exit 1
fi

echo "✓ Post created successfully"
echo ""
echo "========================================="
echo "SUCCESS!"
echo "========================================="
echo "Post ID: $POST_ID"
echo "File ID: $FILE_ID"
echo "View at: https://pamliecoconnect.com/press/$POST_ID"
echo "Media URL: $MEDIA_URL"
echo "File size: $((FILE_SIZE / 1024 / 1024))MB"
echo "========================================="
