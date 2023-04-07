FROM node:19-alpine as builder
USER node
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN yarn install --production
COPY --chown=node:node . .

FROM node:19-alpine
USER node
WORKDIR /home/node/app
COPY --from=builder --chown=node:node /home/node/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /home/node/app/dist ./dist
COPY --from=builder --chown=node:node /home/node/app/package.json .
EXPOSE 4000
CMD [ "yarn", "start" ]