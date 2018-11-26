FROM node:10-alpine
WORKDIR /usr/src/app

RUN npm install -global pm2

COPY . .
RUN npm install --production 

EXPOSE 8180

CMD [ "pm2-runtime", "pm2.json" ]

