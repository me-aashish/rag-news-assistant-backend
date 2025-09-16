FROM node:18-alpine

WORKDIR /app

# install deps
COPY package*.json ./
RUN npm ci --production

# copy code
COPY . .

# expose port
EXPOSE 3000

CMD ["node", "server.js"]
