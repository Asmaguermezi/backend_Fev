const SessionEtude = require('../models/SessionEtude');
const User = require('../models/userSchema'); // ✅ nom du modèle correct

module.exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await SessionEtude.find();
    if (!sessions.length) {
      throw new Error("Aucune session trouvée");
    }
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getSessionById = async (req, res) => {
  try {
    const id = req.params.id;
    const session = await SessionEtude.findById(id).populate("participants");
    if (!session) {
      throw new Error("Session introuvable");
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteSessionById = async (req, res) => {
  try {
    const id = req.params.id;
    const session = await SessionEtude.findById(id);
    if (!session) {
      throw new Error("Session introuvable");
    }
    await SessionEtude.findByIdAndDelete(id);
    res.status(200).json("Session supprimée");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addSession = async (req, res) => {
  try {
    const { date, heure, participants } = req.body;
    if (!date || !heure) {
      throw new Error("Données invalides");
    }
    const session = await SessionEtude.create({ date, heure, participants });
    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateSession = async (req, res) => {
  try {
    const id = req.params.id;
    const { date, heure } = req.body;

    const session = await SessionEtude.findById(id);
    if (!session) {
      throw new Error("Session introuvable");
    }

    if (!date || !heure) {
      throw new Error("Données invalides");
    }

    await SessionEtude.findByIdAndUpdate(id, { $set: { date, heure } });
    const updated = await SessionEtude.findById(id);

    res.status(200).json({ updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.ajouterParticipant = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    const session = await SessionEtude.findById(sessionId);
    if (!session) {
      throw new Error("Session introuvable");
    }

    const utilisateur = await User.findById(userId); // ✅ correction ici
    if (!utilisateur) {
      throw new Error("Utilisateur introuvable");
    }

    await SessionEtude.findByIdAndUpdate(sessionId, {
      $push: { participants: userId },
    });

    res.status(200).json("Participant ajouté");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.retirerParticipant = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    await SessionEtude.findByIdAndUpdate(sessionId, {
      $pull: { participants: userId },
    });

    res.status(200).json("Participant retiré");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
