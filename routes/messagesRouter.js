const express = require('express');
const messagesController = require('../controllers/messageControllers');

const router = express.Router();

// Route to get all messages
router.get('/', messagesController.getAllMessages);

// Route to get a specific message by ID
router.get('/:id', messagesController.getMessageById);

// Route to create a new message
router.post('/', messagesController.createMessage);

// Route to update a message by ID
router.put('/:id', messagesController.updateMessage);

// Route to delete a message by ID
router.delete('/:id', messagesController.deleteMessage);

module.exports = router;