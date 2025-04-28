const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionsControllers');

router.get('/', sessionController.getAllSessions);
router.get('/:id', sessionController.getSessionById);
router.post('/', sessionController.addSession);
router.put('/:id', sessionController.updateSession);
router.delete('/:id', sessionController.deleteSessionById);
router.post('/ajouter-participant', sessionController.ajouterParticipant);
router.post('/retirer-participant', sessionController.retirerParticipant);


module.exports = router;