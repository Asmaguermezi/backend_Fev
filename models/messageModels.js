const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SessionEtude", // 🔗 Référence vers ta collection des sessions
    required: true,
  },
  sender: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
