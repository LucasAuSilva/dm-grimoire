
# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the Vite app
RUN npm run build


# ---- Production stage ----
FROM nginx:alpine

# Copy built app to nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
