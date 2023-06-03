FROM node:18.12.1-alpine3.16

WORKDIR /app

COPY ./dist/apps/tasks-ecs-task .
COPY ./libs/prisma/src/schema.prisma ./prisma/

RUN npm install --production

ENV ECS_CONTAINER_STOP_TIMEOUT=2

CMD node main.js
