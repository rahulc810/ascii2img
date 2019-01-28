FROM node:8-slim

ARG COVERALLS_REPO_TOKEN
ENV COVERALLS_REPO_TOKEN=$COVERALLS_REPO_TOKEN

COPY . /usr/src/ascii2img
WORKDIR /usr/src/ascii2img
RUN npm install
RUN npm test
RUN npm run coveralls

EXPOSE 3000

CMD ["npm", "start"]