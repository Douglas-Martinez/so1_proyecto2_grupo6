FROM node:16-alpine3.13
WORKDIR /urs/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 10000
CMD ["node", "server.js"]