# Base image — Node.js version
FROM node:20-alpine AS builder

# Working directory container ke andar
WORKDIR /app

# package.json copy karo — dependencies install karne ke liye
COPY package*.json ./

# Dependencies install karo
RUN npm install

# Baaki saara code copy karo
COPY . .

# TypeScript build karo
RUN npm run build


# Production Stage — final production image
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD ["npm", "start"]