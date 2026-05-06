# Optimized Dockerfile for Hugging Face Spaces (16GB RAM support)
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=7860

WORKDIR /app

# Install dependencies from the server directory
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the server application code
COPY server/ .

# Hugging Face Spaces requires port 7860
EXPOSE 7860

# Run the FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
