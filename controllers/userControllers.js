const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');

// Inscription d'un utilisateur
const inscriptionUtilisateur = async (req, res) => {
  try {
    const { name, email, password, role, specialite } = req.body;

    if (!name || !email || !password || !role || !specialite) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const user = new User({ name, email, password, role, specialite });
    await user.save();

    res.status(201).json({ message: "Utilisateur inscrit avec succès", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Connexion d'un utilisateur
const loginUtilisateur = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user._id }, 'net secret pfe', { expiresIn: '1d' });
    res.cookie('jwt_token_9antra', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.status(200).json({ message: "Connexion réussie", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Déconnexion
const logoutUtilisateur = async (req, res) => {
  try {
    res.clearCookie('jwt_token_9antra');
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les utilisateurs
const getAllUtilisateurs = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un utilisateur par ID
const getUtilisateurParId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Recherche par nom
const searchUtilisateurByNom = async (req, res) => {
  try {
    const { nom } = req.query;
    const users = await User.find({ name: { $regex: nom, $options: 'i' } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Liste des utilisateurs par rôle
const listeUtilisateursParRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mise à jour d'un utilisateur
const updateUtilisateur = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Suppression d'un utilisateur
const supprimerUtilisateur = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Inscription avec image (exemple simple)
const inscriptionUtilisateurAvecImage = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const image = req.file ? req.file.filename : null;

    const user = new User({ name, email, password, role, image });
    await user.save();

    res.status(201).json({ message: "Utilisateur inscrit avec image", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mise à jour avec image
const updateUtilisateurAvecImage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Export de toutes les fonctions
module.exports = {
  inscriptionUtilisateur,
  loginUtilisateur,
  logoutUtilisateur,
  getAllUtilisateurs,
  getUtilisateurParId,
  searchUtilisateurByNom,
  listeUtilisateursParRole,
  updateUtilisateur,
  supprimerUtilisateur,
  inscriptionUtilisateurAvecImage,
  updateUtilisateurAvecImage
};
