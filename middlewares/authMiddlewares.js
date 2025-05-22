const jwt = require("jsonwebtoken");
const userModel = require("../models/userSchema");

const requireAuthUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token_9antra;

    if (!token) {
      return res.status(401).json({ message: "Pas de token, accès refusé" });
    }

    jwt.verify(token, 'net secret pfe', async (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: "Token invalide" });
      }

      const user = await userModel.findById(decodedToken.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }

      req.user = { id: decodedToken.id }; // ✅ obligatoire pour getMonProfil
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = { requireAuthUser };

