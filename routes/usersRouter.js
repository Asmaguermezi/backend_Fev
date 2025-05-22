const express = require('express');
const router = express.Router();

const utilisateurController = require('../controllers/userControllers');
const upload = require('../middlewares/uploadFile');
const { requireAuthUser } = require('../middlewares/authMiddlewares');

// 🧪 Route de test
router.get('/test', (req, res) => {
  res.status(200).json({ message: '✅ Route test OK !' });
});

// 🔐 Authentification
router.post('/login', utilisateurController.loginUtilisateur);
router.get('/logout', utilisateurController.logoutUtilisateur);

// 👤 Profil connecté (protégé)
router.get('/getMonProfil', requireAuthUser, utilisateurController.getMonProfil);

// 📥 Inscription (avec ou sans image)
router.post('/inscription', utilisateurController.inscriptionUtilisateur);
router.post('/inscriptionAvecImage', upload.single('image'), utilisateurController.inscriptionUtilisateurAvecImage);

// 👥 Utilisateurs (liste, recherche, rôle, etc.)
router.get('/getAllUtilisateurs', requireAuthUser, utilisateurController.getAllUtilisateurs);
router.get('/getUtilisateurById/:id', utilisateurController.getUtilisateurParId);
router.get('/searchUtilisateurByNom', utilisateurController.searchUtilisateurByNom);
router.get('/getUtilisateursParRole/:role', utilisateurController.listeUtilisateursParRole);

// 🛠️ Mise à jour
router.put('/updateUtilisateurById/:id', utilisateurController.updateUtilisateur);
router.put('/updateUtilisateurAvecImage/:id', upload.single('image'), utilisateurController.updateUtilisateurAvecImage);

// ❌ Suppression
router.delete('/deleteUtilisateurById/:id', utilisateurController.supprimerUtilisateur);

module.exports = router;
