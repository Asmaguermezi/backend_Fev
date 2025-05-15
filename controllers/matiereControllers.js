const Matiere = require('../models/matiereModels');
const User = require('../models/userSchema');
// ➕ Ajouter une matière
exports.ajouterMatiere = async (req, res) => {
  try {
    const nouvelleMatiere = await Matiere.create(req.body);
    res.status(201).json(nouvelleMatiere);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📄 Récupérer toutes les matières
exports.getAllMatieres = async (req, res) => {
  try {
    const matieres = await Matiere.find();
    res.status(200).json(matieres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Récupérer une matière par ID
exports.getMatiereById = async (req, res) => {
  try {
    const matiere = await Matiere.findById(req.params.id);
    if (!matiere) return res.status(404).json({ error: 'Matière non trouvée' });
    res.status(200).json(matiere);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier une matière
exports.updateMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(matiere);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Supprimer une matière
exports.deleteMatiere = async (req, res) => {
  try {
    await Matiere.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Matière supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
