FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install dotenv

COPY . .

EXPOSE 4000

CMD ["node", "main.js"]
