FROM node:20.11.1-alpine

WORKDIR /app

COPY yarn.lock package.json ./

RUN yarn --pure-lockfile

COPY . .

RUN yarn build

EXPOSE 9000

CMD ["yarn", "start"]

# REDEPLOY