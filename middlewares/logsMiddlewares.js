const fs = require('fs');
const Log = require('../models/logsModels'); // Correction de l'importation

function logMiddleware(req, res, next) {
  const startTime = new Date();

  res.on('finish', async () => {
    const headers = JSON.stringify(req.headers);
    const endTime = new Date();
    const executionTime = endTime - startTime;
    const body = Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : 'N/A';
    const referer = req.headers.referer || 'N/A';

    // Formatage du log texte
    const log = `${new Date().toISOString()} - Méthode: ${req.method}, URL: ${req.originalUrl}, IP: ${req.ip}, Referer: ${referer}, Statut: ${res.statusCode}, Utilisateur: ${req.user ? `${req.user._id} | ${req.user.nom}` : 'N/A'}, Headers: ${headers}, Temps d'exécution: ${executionTime} ms, Corps de la requête: ${body}, Résultat: ${res.locals.data || 'N/A'}\n`;

    // Objet pour MongoDB
    const logEntry = {
      timestamp: new Date(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      referer,
      status: res.statusCode,
      user: req.user ? { id: req.user._id, nom: req.user.nom } : null,
      headers: req.headers,
      executionTime,
      requestBody: Object.keys(req.body).length > 0 ? req.body : null,
      result: res.locals.data || 'N/A',
    };

    try {
      // Écriture dans le fichier log
      fs.appendFileSync('plateforme.log', log);

      // Enregistrement dans MongoDB
      await Log.create(logEntry);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du log :", err);
    }
  });

  next();
}

module.exports = logMiddleware;