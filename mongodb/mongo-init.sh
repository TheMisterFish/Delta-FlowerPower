mongo -- "$MONGO_INITDB_DATABASE" <<EOF
    db.createUser({
        user: "$MONGO_INITDB_ROOT_USERNAME",
        pwd: "$MONGO_INITDB_ROOT_PASSWORD",
        roles: [{
            role: "readWrite",
            db: "$MONGO_INITDB_DATABASE"
        }]
    });

    db.users.insertOne({
        fullname: "admin",
        email: "admin@flowerpower.com",
        role: "admin",
        password: "$INITIAL_PASSWORD"
    });

    db.users.insertOne({
        fullname: "researcher",
        email: "researcher@flowerpower.com",
        role: "researcher",
        password: "$INITIAL_PASSWORD"
    });
EOF