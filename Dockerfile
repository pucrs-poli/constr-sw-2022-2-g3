FROM node:16-alpine
WORKDIR /app
COPY package*.json setup-dotenv.js ./
RUN npm ci
COPY . .
RUN npm run build
CMD node build/src/server.js
