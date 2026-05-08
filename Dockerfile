# Optimized Dockerfile for Hugging Face Spaces (16GB RAM support)
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=7860
ENV HOME=/home/user

# Create a non-root user (UID 1000 is required for HF Spaces)
RUN useradd -m -u 1000 user

# Switch to the non-root user
USER user
ENV PATH="$HOME/.local/bin:$PATH"

WORKDIR $HOME/app

# Install dependencies as the non-root user
COPY --chown=user server/requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Copy the server application code
COPY --chown=user server/ .

# Hugging Face Spaces requires port 7860
EXPOSE 7860

# Run the FastAPI app
CMD ["python3", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
