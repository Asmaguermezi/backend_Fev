const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const utilisateurController = require('../controllers/userControllers');

const upload = require('../middlewares/uploadFile');
const { requireAuthUser } = require('../middlewares/authMiddleware');

// Routes pour les utilisateurs de la plateforme collaborative
router.post('/inscription', utilisateurController.inscriptionUtilisateur);
router.post('/login', utilisateurController.loginUtilisateur);
router.get('/logout', utilisateurController.logoutUtilisateur);

=======

console.log("✅ Le fichier usersRouter.js est bien chargé !");

const utilisateurController = require('../controllers/userControllers');
const upload = require('../middlwares/uploadFile');
const { requireAuthUser } = require('../middlwares/authMiddlware');

// 🧪 Route de test pour vérifier la connexion avec le routeur
router.get('/test', (req, res) => {
  res.status(200).json({ message: '✅ Route test OK !' });
});

// 📥 Inscription
router.post('/inscription', utilisateurController.inscriptionUtilisateur);

// 🔐 Connexion / Déconnexion
router.post('/login', utilisateurController.loginUtilisateur);
router.get('/logout', utilisateurController.logoutUtilisateur);

// 👥 Gestion des utilisateurs
>>>>>>> d93939d ( création du projet backend)
router.get('/getAllUtilisateurs', requireAuthUser, utilisateurController.getAllUtilisateurs);
router.get('/getUtilisateurById/:id', utilisateurController.getUtilisateurParId);
router.get('/searchUtilisateurByNom', utilisateurController.searchUtilisateurByNom);
router.get('/getUtilisateursParRole/:role', utilisateurController.listeUtilisateursParRole);

router.put('/updateUtilisateurById/:id', utilisateurController.updateUtilisateur);
router.delete('/deleteUtilisateurById/:id', utilisateurController.supprimerUtilisateur);

<<<<<<< HEAD
router.post('/inscriptionAvecImage', upload.single('image_utilisateur'), utilisateurController.inscriptionUtilisateurAvecImage);
=======
// 📸 Inscription / Mise à jour avec image
router.post('/inscriptionAvecImage', upload.single('image_utilisateur'), utilisateurController.inscriptionUtilisateurAvecImage);
router.put('/updateUtilisateurAvecImage/:id', upload.single('image_utilisateur'), utilisateurController.updateUtilisateurAvecImage);
>>>>>>> d93939d ( création du projet backend)

module.exports = router;
