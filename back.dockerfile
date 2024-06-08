FROM node:latest

RUN mkdir -p /back

WORKDIR /back

COPY ./back/package.json .

RUN npm install --quiet

COPY . .
