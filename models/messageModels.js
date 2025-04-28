const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const messageSchema = new mongoose.Schema({
  groupName: { type: String, required: true }, // Nom du groupe (ex : "etudiants" ou "etudiants-enseignants")
  sender: { type: String, required: true }, // Nom ou ID de l'expéditeur
  message: { type: String, required: true }, // Contenu du message
  timestamp: { type: Date, default: Date.now }, // Date et heure du message
});

module.exports = mongoose.model('message', messageSchema);