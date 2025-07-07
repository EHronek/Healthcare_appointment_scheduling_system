# Base Image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=api.v1.app
ENV FLASK_ENV=development

# Set working directory inside container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    libssl-dev \
    libffi-dev \
    libpq-dev \
    netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app code
COPY . .

# Make entrypoint executable
RUN chmod +x entrypoint.sh

EXPOSE 5000

# Use entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
