const Message = require('../models/message');

async function getAllMessages(req, res) {
    console.log("messageController ### getAllMessages");
}

async function getMessagesByChatId(req, res) {
    console.log("messageController ### getMessagesByChatId");

    try {
        const chatId = req.params.id;
        
        const messages = await Message.find({chatId: chatId});
        console.log(`messageController ### extracted {${messages.length}} messages for chat id: ` + chatId);

        res.status(201).json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
}

module.exports = {
    getAllMessages,
    getMessagesByChatId
}