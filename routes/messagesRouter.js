const express = require('express');
const messagesController = require('../controllers/messageControllers');

const router = express.Router();

// 📥 Récupérer tous les messages (admin ou debug)
router.get('/', messagesController.getAllMessages);

// 🔍 Récupérer un message spécifique par ID
router.get('/:id', messagesController.getMessageById);

// 🆕 Créer un nouveau message
router.post('/', messagesController.createMessage);

// 📝 Mettre à jour un message existant
router.put('/:id', messagesController.updateMessage);

// 🗑️ Supprimer un message
router.delete('/:id', messagesController.deleteMessage);

// 📌 🔁 Récupérer tous les messages d'une session (pour VideoCall.js)
router.get('/session/:sessionId', messagesController.getMessagesBySessionId);

module.exports = router;
