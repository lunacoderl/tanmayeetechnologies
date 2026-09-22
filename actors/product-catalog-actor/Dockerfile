# Multi-stage Dockerfile for Apify Actor with Playwright & Chrome
FROM apify/actor-node-playwright-chrome:20 AS builder

WORKDIR /usr/src/app

# Copy package manifests first for efficient docker caching
COPY package*.json ./

# Install production dependencies
RUN npm --prefer-offline \
    --no-audit \
    --no-fund \
    ci --omit=dev

# Copy source code and definitions
COPY . ./

# Final runtime image
FROM apify/actor-node-playwright-chrome:20

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

# Run the actor
CMD ["npm", "start"]
