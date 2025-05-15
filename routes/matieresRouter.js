const express = require('express');
const router = express.Router();
const matiereCtrl = require('../controllers/matiereControllers');

// Routes CRUD
router.post('/', matiereCtrl.ajouterMatiere);
router.get('/', matiereCtrl.getAllMatieres);
router.get('/:id', matiereCtrl.getMatiereById);
router.put('/:id', matiereCtrl.updateMatiere);
router.delete('/:id', matiereCtrl.deleteMatiere);

module.exports = router;
