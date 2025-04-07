const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/userControllers');

const upload = require('../middlewares/uploadFile');
const { requireAuthUser } = require('../middlewares/authMiddleware');

// Routes pour les utilisateurs de la plateforme collaborative
router.post('/inscription', utilisateurController.inscriptionUtilisateur);
router.post('/login', utilisateurController.loginUtilisateur);
router.get('/logout', utilisateurController.logoutUtilisateur);

router.get('/getAllUtilisateurs', requireAuthUser, utilisateurController.getAllUtilisateurs);
router.get('/getUtilisateurById/:id', utilisateurController.getUtilisateurParId);
router.get('/searchUtilisateurByNom', utilisateurController.searchUtilisateurByNom);
router.get('/getUtilisateursParRole/:role', utilisateurController.listeUtilisateursParRole);

router.put('/updateUtilisateurById/:id', utilisateurController.updateUtilisateur);
router.delete('/deleteUtilisateurById/:id', utilisateurController.supprimerUtilisateur);

router.post('/inscriptionAvecImage', upload.single('image_utilisateur'), utilisateurController.inscriptionUtilisateurAvecImage);

module.exports = router;
