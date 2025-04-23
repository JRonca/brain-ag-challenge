# Build

FROM node:22 AS build

WORKDIR  /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

# Execução

FROM node:22-alpine3.20

WORKDIR  /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 3333

CMD ["npm", "run", "start:prod"]
