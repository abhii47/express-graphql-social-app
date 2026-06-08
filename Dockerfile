# Base image — Node.js version
FROM node:20-alpine

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

# Port expose karo
EXPOSE 4000

# App start karo
CMD ["npm", "start"]