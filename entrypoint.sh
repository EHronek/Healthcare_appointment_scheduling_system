#!/bin/bash
set -e

echo "⏳ Waiting for db:3306 to be ready..."

# Use netcat to wait for MySQL
until nc -z db 3306; do
  echo "⌛ Still waiting for MySQL..."
  sleep 1
done

echo "✅ MySQL is up!"

# Start the Flask application
# exec gunicorn --bind 0.0.0.0:5000 --workers 4 api.v1.app:app

# Run the app the same way you do locally
exec python3 -m api.v1.app
