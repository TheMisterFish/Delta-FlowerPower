db.createUser({
    user: "admin",
    pwd: "admin",
    roles: [{
        role: "readWrite",
        db: "flowerpower"
    }]
});

db.users.insertOne({
    fullname: "researcher",
    email: "researcher@flowerpower.com",
    role: "admin",
    password: "$2b$10$gw1WPMhDArK1JaWAgKGhWezZlalBrjdRQhlIx9hlUQ0sH86UwiTQW"
})