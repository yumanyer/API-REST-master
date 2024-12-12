FROM node

WORKDIR /API-REST-master

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9000

CMD ["npm","start"]
# CMD ["npm","run","test"]
# CMD ["npm","run","dev"]
