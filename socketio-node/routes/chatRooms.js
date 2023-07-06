const express = require('express');
const router = express.Router();
const chatRoomController = require('../controllers/chatRoomController');

// Read all users chats
router.get('/:id', chatRoomController.getAllUserChats);

module.exports = router;
