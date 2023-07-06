const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Read all by user id
router.get('/:id', taskController.getAllTasksByUserId);

// create task
router.post('/', taskController.createTask), 

// update task
router.put('/:id', taskController.updateTask);

module.exports = router;
