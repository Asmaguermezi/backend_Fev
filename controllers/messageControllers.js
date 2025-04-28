const Message = require('../models/messageModels');

// Récupérer tous les messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Échec de récupération des messages' });
    }
};

// Récupérer un message par ID
exports.getMessageById = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ error: 'Message non trouvé' });
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Créer un message
exports.createMessage = async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        const saved = await newMessage.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du message' });
    }
};

// Mettre à jour un message
exports.updateMessage = async (req, res) => {
    try {
        const updated = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Message non trouvé' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
};

// Supprimer un message
exports.deleteMessage = async (req, res) => {
    try {
        const deleted = await Message.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Message non trouvé' });
        res.status(200).json({ message: 'Message supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};
