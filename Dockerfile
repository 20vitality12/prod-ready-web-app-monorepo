#FROM node:18.12.1-alpine3.16 as builder
#
#ARG APP
#
#WORKDIR /app
#
#COPY . /app/
#
#RUN npm install && npx nx build $APP
#
#FROM node:18.12.1-alpine3.16 as runner
#
#ARG APP
#
#WORKDIR /srv
#
#ENV ECS_CONTAINER_STOP_TIMEOUT=2
#
#COPY --from=builder /app/dist/apps/$APP /srv/
#COPY --from=builder /app/libs/prisma/src/schema.prisma ./prisma/
#
#RUN npm install --production
#
#CMD node main.js
FROM node:18.12.1-alpine3.16

WORKDIR /app

COPY ./dist/apps/server .
COPY ./libs/prisma/src/schema.prisma ./prisma/

RUN npm install --production

ENV ECS_CONTAINER_STOP_TIMEOUT=2

CMD node main.js
