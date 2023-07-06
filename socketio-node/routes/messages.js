const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Read all
router.get('/', messageController.getAllMessages);

// Read all by chat id
router.get('/:id', messageController.getMessagesByChatId), 

module.exports = router;
