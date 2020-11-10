FROM mongo:latest

WORKDIR /usr/src/mongo

COPY ./mongo-init.sh /docker-entrypoint.sh
RUN ls
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

CMD "mongod --auth --port 27018"