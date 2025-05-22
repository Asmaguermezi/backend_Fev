const Notification = require('../models/notificationModels');
const User = require('../models/userSchema');

// ➕ Ajouter une notification et l'émettre en direct
exports.ajouterNotification = async (req, res) => {
  try {
    const { titre, contenu, lien, destinataire, sessionId } = req.body;

    // Validation des champs requis
    if (!titre || !contenu) {
      return res.status(400).json({ error: 'Titre et contenu requis' });
    }

    // Création de la notification
    const nouvelleNotif = new Notification({
      titre,
      contenu,
      lien: lien || null,
      destinataire: destinataire || null,
      sessionId: sessionId || null, // ✅ Ajout du champ sessionId
      date: new Date()
    });

    const notif = await nouvelleNotif.save();

    // ✅ Émission Socket.IO en temps réel
    const io = req.app.get("io");
    io.emit("nouvelle-notification", notif); // envoyer à tous les clients

    res.status(201).json(notif);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📥 Récupérer toutes les notifications (corrigé avec sessionId)
exports.getAllNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find()
      .sort({ date: -1 })
      .populate('destinataire')
      .select('titre contenu sessionId date destinataire'); // ✅ Ajout ici

    res.status(200).json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 📌 Récupérer une notification par ID
exports.getNotificationById = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id).populate('destinataire');
    if (!notif) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }
    res.status(200).json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📝 Modifier une notification
exports.updateNotification = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!notif) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }
    res.status(200).json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Supprimer une notification
exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }
    res.status(200).json({ message: 'Notification supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
