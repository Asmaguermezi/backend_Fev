const mongoose = require('mongoose');

const sessionEtudeSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  heure: { type: String, required: true },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur', // Référence au modèle Utilisateur
    },
  ],
});

module.exports = mongoose.model('SessionEtude', sessionEtudeSchema);