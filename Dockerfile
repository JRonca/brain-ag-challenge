# Build

FROM node:22 AS build

WORKDIR  /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY src ./src
COPY tsconfig*.json ./
COPY prisma ./prisma
COPY entrypoint.sh ./entrypoint.sh

RUN npx prisma generate

RUN npm run build

RUN npm prune --omit=dev --legacy-peer-deps

# Execução

FROM node:22-alpine3.20

WORKDIR  /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/node_modules ./node_modules

COPY entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

EXPOSE 3333

CMD ["./entrypoint.sh"]