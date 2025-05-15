const express = require('express');
const router = express.Router();

const utilisateurController = require('../controllers/userControllers');
const upload = require('../middlewares/uploadFile');
const { requireAuthUser } = require('../middlewares/authMiddlewares');

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
router.get('/getAllUtilisateurs', requireAuthUser, utilisateurController.getAllUtilisateurs);
router.get('/getUtilisateurById/:id', utilisateurController.getUtilisateurParId);
router.get('/searchUtilisateurByNom', utilisateurController.searchUtilisateurByNom);
router.get('/getUtilisateursParRole/:role', utilisateurController.listeUtilisateursParRole);

router.put('/updateUtilisateurById/:id', utilisateurController.updateUtilisateur);
router.delete('/deleteUtilisateurById/:id', utilisateurController.supprimerUtilisateur);

// 📸 Inscription / Mise à jour avec image
router.post('/inscriptionAvecImage', upload.single('image_utilisateur'), utilisateurController.inscriptionUtilisateurAvecImage);
router.put('/updateUtilisateurAvecImage/:id', upload.single('image_utilisateur'), utilisateurController.updateUtilisateurAvecImage);

module.exports = router;
