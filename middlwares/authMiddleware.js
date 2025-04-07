const jwt = require("jsonwebtoken");
const userModel = require("../models/userSchema"); // Assurez-vous que le chemin est correct
const { requireAuthUser } = require('../middlewares/authMiddleware');

router.get('/testAuth', requireAuthUser, (req, res) => {
  res.status(200).json({ message: "Accès autorisé", user: req.session.user });
});

const requireAuthUser = async (req, res, next) => {
  try {
    // Récupération du token depuis les cookies
    const token = req.cookies.jwt_token_9antra;

    if (!token) {
      req.session.user = null; // Pas de token, session utilisateur null
      return res.status(401).json({ message: "Pas de token, accès refusé" });
    }

    // Vérification du token
    jwt.verify(token, 'net secret pfe', async (err, decodedToken) => {
      if (err) {
        console.error("Erreur au niveau du token :", err.message);
        req.session.user = null; // Session utilisateur null en cas d'erreur
        return res.status(403).json({ message: "Token invalide" });
      }

      // Si le token est valide, récupérer l'utilisateur
      const user = await userModel.findById(decodedToken.id);
      if (!user) {
        req.session.user = null; // Utilisateur introuvable
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }

      req.session.user = user; // Stocker l'utilisateur dans la session
      next(); // Passer au middleware suivant
    });
  } catch (error) {
    console.error("Erreur dans le middleware requireAuthUser :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = { requireAuthUser };