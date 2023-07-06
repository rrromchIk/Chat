const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET ALL
router.get('/', userController.getAllUsers);

module.exports = router;
