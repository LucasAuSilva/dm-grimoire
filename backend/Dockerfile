FROM python:3.12-slim

# Install ONLY runtime dependencies — no build-essential
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libcairo2 \
    libglib2.0-0 \
    libgdk-pixbuf-2.0-0 \
    fonts-liberation \
    fontconfig \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /app

# Install uv first (cached layer — only reruns if this line changes)
RUN pip install --no-cache-dir uv

# Copy ONLY dependency files first (cached layer — only reruns if deps change)
COPY pyproject.toml uv.lock ./

# Install Python dependencies
RUN uv pip install --system --no-cache .

# Copy fonts and register them
COPY fonts/ /usr/local/share/fonts/custom/
RUN fc-cache -fv

# Copy app code LAST (this layer changes most often)
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
