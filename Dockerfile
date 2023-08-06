FROM node:18

ENV DOCKER true
ENV PORT 8080
ENV DOMAIN http://localhost:8080
ENV DB_TYPE json
ENV DB_HOST 127.0.0.1
ENV DB_PORT 27017
ENV DB_JSON_PATH ./db.json

WORKDIR /usr/src/quecto
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${PORT}
CMD [ "npm", "start" ]