# Use Bun
FROM oven/bun:1

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Generate SvelteKit types
RUN bun x svelte-kit sync

# Build the application
RUN bun run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
ENV HOST=0.0.0.0
CMD ["bun", "build/index.js"]
