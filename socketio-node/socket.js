const socketio = require('socket.io');
const messageController = require('./controllers/messageController');
const Message = require('./models/message');
const ChatRoom = require('./models/chatRoom');

module.exports = function (server) {
  const io = socketio(server, {
    cors: {
      origin: "*",
    }
  });

  io.on('connection', async (socket) => {
    console.log('socket.js ### Users socket connected. Id: ', socket.id);

    socket.on("join chat room", (chatRoom) => {
        socket.join(chatRoom.id);
        console.log("socket.js ### Client socket joined chat room: " + chatRoom.id); 
    });

    // Listen for incoming chat messages
    socket.on('message', async (message) => {
      console.log("socket.js ### Recieved mesage: " + JSON.stringify(message));

      console.log('Message created successfully.');
      const messageToStore = new Message(message);
      await messageToStore.save();

      io.to(message.chatId).emit("message", message);
      console.log("socket.js ### Message sent to chat room: " + message.chatId);
    });

    // Listen for incoming chat messages
    socket.on("add chat room", async (chatRoom) => {
      console.log("socket.js ### Add chat room event on server");

      socket.join(chatRoom.id);
      console.log("socket.js ### Client socket joined chat room: " + chatRoom.id);

      try {
        const chatRoomToStore = new ChatRoom(chatRoom);
        await chatRoomToStore.save();
        console.log('Chat room created successfully.');
      } catch(asd) {
        console.log("Chat room already exist");
      }

      socket.broadcast.emit("new chat room", chatRoom);
      console.log("socket.js ### new chat room event emited for chat room: " + chatRoom.id);
    });

    socket.on("disconnect", () => {
        console.log("socket.js ###  Socket disconnected. Id: " + socket.id);
    })
  });
};

