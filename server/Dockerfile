# Use a highly optimized, slim Python image
FROM python:3.11-slim

# Set environment variables to reduce memory footprint
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy requirements first for better layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the default port
EXPOSE 8080

# Start uvicorn using the PORT environment variable provided by the platform
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
