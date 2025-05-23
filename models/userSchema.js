const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Pour hacher les mots de passe

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  role: { 
    type: String, 
    enum: ['Etudiant', 'Enseignant', 'Admin', 'etudiant', 'enseignant', 'admin'], // ajout des minuscules
    required: true 
  },
  specialite: {
  type: String,
  required: function () {
    return this.role.toLowerCase() === 'etudiant' || this.role.toLowerCase() === 'enseignant';
  },
  trim: true
},

  notifications: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Notification' 
  }], // Relation avec les notifications
  messages: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message' 
  }], // Relation avec les messages
  sessions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SessionEtude' 
  }], // Relation avec les sessions d'étude
  matieres: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Matiere' 
  }], // Relation avec les matières
}, { timestamps: true }); // Ajout des champs createdAt et updatedAt automatiquement

// Middleware pour hacher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save', async function (next) {
  // Ne hache le mot de passe que s'il est modifié ou nouvellement créé
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Génération du sel
    this.password = await bcrypt.hash(this.password, salt); // Hachage du mot de passe
    next();
  } catch (error) {
    next(error); // Passe l'erreur au middleware suivant
  }
});

// Méthode pour vérifier le mot de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Exportation du modèle utilisateur
module.exports = mongoose.model('User', userSchema);