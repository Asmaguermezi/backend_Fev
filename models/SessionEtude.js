const mongoose = require('mongoose');

const sessionEtudeSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  heure: { type: String, required: true },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // ✅ le nom exact utilisé dans userSchema.js
    },
  ],
});

module.exports = mongoose.model('SessionEtude', sessionEtudeSchema);
