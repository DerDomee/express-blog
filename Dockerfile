FROM node:16.17-alpine3.15
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN rm -rf ./node_modules
RUN rm -rf ./src
RUN npm ci --omit-dev
EXPOSE 3000-3002
ENTRYPOINT ["npm", "start"]
