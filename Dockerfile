FROM node:21.7.1-alpine3.19 AS base
RUN npm config set strict-ssl false
RUN npm config set registry http://192.168.100.15:8081/repository/npm-group/
RUN npm i -g pnpm

FROM base AS dependencies
WORKDIR /usr/src/app
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm i

FROM base AS build
WORKDIR /usr/src/app
COPY --chown=node:node . .
COPY --chown=node:node --from=dependencies /usr/src/app/node_modules ./node_modules
RUN pnpm prisma:generate
RUN pnpm build
RUN pnpm prune --prod

FROM node:21.7.1-alpine3.19 AS production
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
# Start the server using the production build
CMD [ "node", "dist/main.js" ]