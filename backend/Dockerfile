FROM python:3.12-slim

# Install system dependencies required by WeasyPrint
RUN apt-get update && apt-get install -y \
    build-essential \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libcairo2 \
    libffi-dev \
    libglib2.0-0 \
    libgdk-pixbuf-2.0-0 \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency files
COPY pyproject.toml ./
COPY uv.lock ./

# Install uv
RUN pip install uv

# Install Python dependencies
RUN uv pip install --system .

# Copy the rest of the application
COPY . .

## Copying fonts and adding them to container
RUN mkdir -p /usr/local/share/fonts/custom
RUN cp fonts/*.ttf /usr/local/share/fonts/custom/ && fc-cache -fv

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
