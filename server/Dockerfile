FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy prisma schema
COPY prisma ./prisma/

# Generate prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Create uploads directory (needed for persistence mount)
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Start command (Run migrations and start app)
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
