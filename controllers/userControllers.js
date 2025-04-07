const Utilisateur = require('../models/userSchema');
const jwt = require('jsonwebtoken');

const maxTime = 24 * 60 * 60; // 24 heures
const secretKey = 'net secret pfe';

const createToken = (id) => jwt.sign({ id }, secretKey, { expiresIn: maxTime });

exports.inscriptionUtilisateur = async (req, res) => {
  try {
    const { nom, email, motDePasse, role, specialite, matieresAReviser, matieresEnseignees, tarifCours } = req.body;

    const nouvelUtilisateur = await Utilisateur.create({
      nom,
      email,
      motDePasse,
      role,
      specialite: role === 'Etudiant' ? specialite : undefined,
      matieresAReviser: role === 'Etudiant' ? matieresAReviser : undefined,
      matieresEnseignees: role === 'Enseignant' ? matieresEnseignees : undefined,
      tarifCours: role === 'Enseignant' ? tarifCours : undefined,
    });

    res.status(201).json({ nouvelUtilisateur });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.inscriptionUtilisateurAvecImage = async (req, res) => {
  try {
    const { nom, email, motDePasse, role } = req.body;
    const { filename } = req.file;

    const utilisateur = await Utilisateur.create({
      nom,
      email,
      motDePasse,
      role,
      image: filename,
    });

    res.status(200).json({ utilisateur });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUtilisateur = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const utilisateur = await Utilisateur.findOne({ email, motDePasse });

    if (!utilisateur) throw new Error('Email ou mot de passe incorrect.');

    const token = createToken(utilisateur._id);

    res.cookie('jwt_token_plateforme', token, { httpOnly: true, maxAge: maxTime * 1000 });
    res.status(200).json({ utilisateur });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.logoutUtilisateur = async (req, res) => {
  try {
    res.cookie('jwt_token_plateforme', '', { httpOnly: true, maxAge: 1 });
    res.status(200).json({ message: 'Déconnecté' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.status(200).json({ utilisateurs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUtilisateurParId = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id);
    if (!utilisateur) throw new Error('Utilisateur introuvable');
    res.status(200).json({ utilisateur });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.supprimerUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByIdAndDelete(req.params.id);
    if (!utilisateur) throw new Error('Utilisateur introuvable');
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, email } = req.body;

    await Utilisateur.findByIdAndUpdate(id, { nom, email });
    const updated = await Utilisateur.findById(id);

    res.status(200).json({ updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchUtilisateurByNom = async (req, res) => {
  try {
    const { nom } = req.query;
    if (!nom) throw new Error('Veuillez fournir un nom.');

    const utilisateurs = await Utilisateur.find({ nom: { $regex: nom, $options: 'i' } });
    const count = utilisateurs.length;
    res.status(200).json({ utilisateurs, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listeUtilisateursParRole = async (req, res) => {
  try {
    const { role } = req.params;
    const utilisateurs = await Utilisateur.find({ role });
    res.status(200).json({ utilisateurs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
