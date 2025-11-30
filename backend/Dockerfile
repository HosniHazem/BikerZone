# Development Dockerfile - No build needed
FROM node:18-alpine

# Install FFmpeg for video processing
RUN apk add --no-cache ffmpeg python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Configure npm for better reliability
RUN npm config set fetch-retry-maxtimeout 60000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retries 5 && \
    npm config set registry https://registry.npmjs.org/

# Install dependencies with retry logic
RUN npm install --no-audit --no-fund --legacy-peer-deps || \
    npm install --no-audit --no-fund --legacy-peer-deps || \
    npm install --no-audit --no-fund --legacy-peer-deps && \
    npm cache clean --force

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R node:node /app

# Switch to non-root user
USER node

# Expose port
EXPOSE 3000

# Start in development mode (uses ts-node, no build needed)
CMD ["npm", "run", "start:dev"]
