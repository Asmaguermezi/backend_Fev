const mongoose = require('mongoose');
require('dotenv').config(); // pour lire les variables du fichier .env

const connectToMongoDb = async () => {
  mongoose.set('strictQuery', false);
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("✅ Connecté à MongoDB");
    })
    .catch((err) => {
      console.log("❌ Erreur de connexion MongoDB :", err);
    });
};

module.exports = { connectToMongoDb };
