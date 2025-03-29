FROM node:22-alpine

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

RUN mkdir -p home/node/app/node_modules && chown -R node:node /home/node/app

USER node

COPY --chown=node:node . .
EXPOSE 8080
CMD [ "node", "service.mjs" ]

