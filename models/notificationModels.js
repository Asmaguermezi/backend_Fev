const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  // 📝 Titre de la notification
  titre: {
    type: String,
    required: [true, "Le titre est requis"],
    trim: true,
  },

  // 💬 Contenu du message de la notification
  contenu: {
    type: String,
    required: [true, "Le contenu est requis"],
    trim: true,
  },

  // 🔗 Lien associé à la notification (ex: /videocall/:id)
  lien: {
    type: String,
    required: false,
  },

  // 👤 Destinataire spécifique (optionnel)
  destinataire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // peut être null si envoi global
  },

  // 🆕 Session ID de la visioconférence
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SessionEtude", // adapte si ton modèle s'appelle autrement
    required: false,
  },

  // 📅 Date de création automatique
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
