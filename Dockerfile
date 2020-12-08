FROM node

COPY ./test /app

WORKDIR /app 

RUN npm install

CMD ["npm","start"]

