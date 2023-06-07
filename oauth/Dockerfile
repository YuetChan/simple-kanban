FROM node:14-alpine

ENV NODE_ENV=v1 \

    APISERVER_URL=v2 \

    GOOGLE_CLIENT_SECRET=v3 \
    GOOGLE_CLIENT_ID=v4 \
    GOOGLE_REDIRECT=v5 \

    JWT_SECRET=v6

WORKDIR /app

COPY ./dist/bundle.js .

EXPOSE 3200

CMD [ "node", "bundle.js" ]
