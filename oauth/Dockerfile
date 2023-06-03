FROM node:14-alpine

WORKDIR /app
COPY ./dist/bundle.js .

EXPOSE 3200

CMD [ "node", "bundle.js" ]
