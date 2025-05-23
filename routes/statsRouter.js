const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');       // Chemin corrigé vers le modèle User
const Matiere = require('../models/matiereModels'); // Idem, ajuste si ton fichier s'appelle différemment

// Route GET /api/stats
router.get('/', async (req, res) => {
  try {
    const utilisateurs = await User.countDocuments();
    const enseignants = await User.countDocuments({ role: 'Enseignant' });
    const etudiants = await User.countDocuments({ role: 'Etudiant' });
    const matieres = await Matiere.countDocuments();

    res.status(200).json({
      utilisateurs,
      enseignants,
      etudiants,
      matieres
    });
  } catch (err) {
    console.error("Erreur stats:", err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

module.exports = router;
