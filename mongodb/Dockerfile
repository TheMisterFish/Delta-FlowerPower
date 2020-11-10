FROM mongo:latest
WORKDIR /
RUN ls
COPY ./mongo-init.sh ./docker-entrypoint-initdb.d
RUN ls ./docker-entrypoint-initdb.d
