FROM node:8-slim

ENV CODECOV_TOKEN=8fcafc0d-e18d-4a3a-a2c5-1c85501d8eb3

COPY . /usr/src/ascii2img
WORKDIR /usr/src/ascii2img
RUN npm install
RUN npm test
RUN npm run coveralls

EXPOSE 3000

CMD ["npm", "start"]