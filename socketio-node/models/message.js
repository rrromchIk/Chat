const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
   _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  chatId: String,
  senderName: String,
  content: String,
  time: Date
});

const Message = mongoose.model('Message', messageSchema, 'Messages');

module.exports = Message;
