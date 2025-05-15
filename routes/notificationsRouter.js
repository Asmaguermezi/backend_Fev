const express = require('express');
const router = express.Router();
const notifCtrl = require('../controllers/notificationControllers');

// Routes
router.post('/', notifCtrl.ajouterNotification);
router.get('/', notifCtrl.getAllNotifications);
router.get('/:id', notifCtrl.getNotificationById);
router.put('/:id', notifCtrl.updateNotification);
router.delete('/:id', notifCtrl.deleteNotification);

module.exports = router;
