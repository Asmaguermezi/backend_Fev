const express = require('express');
const router = express.Router();
const osController = require('../controllers/osControllers');

// Route pour récupérer les informations du système d'exploitation
router.get('/info', osController.getOsInformation);

// Route pour une fonctionnalité non implémentée (exemple)
router.get('/esmfonction', osController.esmfonction);

module.exports = router;