FROM mongo:latest

WORKDIR /usr/src/mongo

ADD ./mongo-init.sh /docker-entrypoint-initdb.d/
RUN ls
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

CMD "mongod --auth --port 27018"