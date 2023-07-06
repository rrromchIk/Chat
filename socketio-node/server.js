const express = require("express");
const mongoose = require('mongoose');
const http = require("http");
const cors = require("cors");
const socket = require('./socket');
require('dotenv').config()

mongoose.connect(`mongodb://${process.env['LOCAL_HOST']}:27017/socketioNodeDb`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    console.log("server.js ### Connected to mongo database.");

    const app = express();
    const httpPort = 3000;
    const userRoutes = require("./routes/users");
    const messageRoutes = require("./routes/messages");
    const chatRoomRoutes = require("./routes/chatRooms");
    const taskRoutes = require("./routes/tasks");

    app.use(cors());
    app.use(express.json());
    app.use("/users", userRoutes);
    app.use("/messages", messageRoutes);
    app.use("/chatRooms", chatRoomRoutes);
    app.use("/tasks", taskRoutes);

    const server = http.createServer(app);
    socket(server);

    console.log("server.js ### App, socket and httpServer created.")

    server.listen(httpPort, () => console.log(`Server listening port *${httpPort}`));
});


