# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/

# Install dependencies
RUN npm ci

# Copy project files
COPY apps/web apps/web

# Build frontend
WORKDIR /app/apps/web
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Copy custom nginx configuration if needed
# COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
