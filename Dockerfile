FROM node:18

ENV DOCKER true
ENV PORT=3000
ENV DOMAIN http://localhost:3000
ENV DB_TYPE json
ENV DB_HOST 127.0.0.1
ENV DB_PORT 27017
ENV DB_JSON_PATH ./db.json

WORKDIR /usr/src/quecto
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "app.js", "${PORT}" ]