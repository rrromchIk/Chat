import { io } from 'socket.io-client';

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection(id) {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT, { 
      query: {
        userId: id,
      }
    });

    console.log("Created socket");
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }

  sendMessage(message) {
    this.socket.send(message);
    console.log("Message sent to chatRoom: " + message.chatId + " message: " + message.content);
  }

  recieveMessage(addMessageCb) {
    this.socket.on("message", (message) => {
      console.log("Recieved message: " + JSON.stringify(message));
      addMessageCb(message);
    })
  }

  joinChatRoom(chatRoom) {
    this.socket.emit("join chat room", chatRoom);
    console.log("Client socket joined chat room: " + chatRoom.id);
  }

  addChatRoom(chatRoom) {
    this.socket.emit("add chat room", chatRoom);
    console.log("Client socket emits add chat room event for chat room: " + JSON.stringify(chatRoom));
  }

  newChatRoomAdded(newChatRoomCb) {
    this.socket.on('new chat room', (chatRoom) => {
      console.log("New chat room event recieved for chat room: " + chatRoom.id);
      newChatRoomCb(chatRoom);
    })
  }
}

export default new SocketioService();