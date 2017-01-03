FROM node:latest

MAINTAINER John Lin <linton.tw@gmail.com>

ENV HOME /root

# Define working directory for adding source.
WORKDIR /root

ADD . app-info-server

WORKDIR /root/app-info-server

RUN npm install

RUN         apt-get update && apt-get install -y redis-server
#EXPOSE      6379
#ENTRYPOINT  ["/usr/bin/redis-server"]
CMD ["/bin/sh", "./run.sh"]
#ENTRYPOINT ["redis-server&"]
#CMD ["npm", "start"]
