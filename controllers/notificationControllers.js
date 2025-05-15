const Notification = require('../models/notificationModels');
const User = require('../models/userSchema');
// ➕ Ajouter une notification
exports.ajouterNotification = async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res.status(201).json(notif);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📥 Récupérer toutes les notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find().populate('destinataire');
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Récupérer une notification par ID
exports.getNotificationById = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id).populate('destinataire');
    if (!notif) return res.status(404).json({ error: 'Non trouvée' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📝 Modifier une notification
exports.updateNotification = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Supprimer une notification
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
