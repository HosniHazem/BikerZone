# Development Dockerfile
FROM node:18-alpine

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

# Expose port
EXPOSE 8080

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
