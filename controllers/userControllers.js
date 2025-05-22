const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// 📥 Inscription simple
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

// 🔐 Connexion
const loginUtilisateur = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user._id }, 'net secret pfe', { expiresIn: '1d' });

    res.cookie('jwt_token_9antra', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({ message: "Connexion réussie", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🚪 Déconnexion
const logoutUtilisateur = async (req, res) => {
  try {
    res.clearCookie('jwt_token_9antra');
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👥 Liste complète
const getAllUtilisateurs = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Par ID
const getUtilisateurParId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Par nom
const searchUtilisateurByNom = async (req, res) => {
  try {
    const { nom } = req.query;
    const users = await User.find({ name: { $regex: nom, $options: 'i' } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Par rôle
const listeUtilisateursParRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Mise à jour sans image
const updateUtilisateur = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧽 Suppression
const supprimerUtilisateur = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🖼️ Inscription avec image
const inscriptionUtilisateurAvecImage = async (req, res) => {
  try {
    const { name, email, password, role, specialite } = req.body;
    const image = req.file ? req.file.filename : null;

    const user = new User({ name, email, password, role, specialite, image });
    await user.save();

    res.status(201).json({ message: "Utilisateur inscrit avec image", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🖼️ Mise à jour avec image
const updateUtilisateurAvecImage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Supprimer tous les champs indésirables comme les tableaux vides ou chaînes vides
    for (let key in updateData) {
      if (Array.isArray(updateData[key]) && updateData[key].length === 1 && updateData[key][0] === "") {
        updateData[key] = [];
      }
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (req.file) {
      const oldPath = path.join(__dirname, "../public/files/", existingUser.image);
      if (existingUser.image && fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      updateData.image = req.file.filename;
    } else {
      updateData.image = existingUser.image;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 👤 Profil de l'utilisateur connecté
const getMonProfil = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Non autorisé" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Exports
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
  updateUtilisateurAvecImage,
  getMonProfil
};
