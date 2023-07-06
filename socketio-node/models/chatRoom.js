const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
      },
      id: { 
        type: String,
        index: {
          unique: true,
          dropDups: true
        }
      },
      members: Array
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema, "ChatRooms");

module.exports = ChatRoom;