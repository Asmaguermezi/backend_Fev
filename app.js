require('dotenv').config(); // 🔐 Pour lire les variables du fichier .env

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const { connectToMongoDb } = require('./config/db'); // 📦 Connexion MongoDB

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const osRouter = require('./routes/osRouter');
const sessionsRouter = require('./routes/sessionsRouter');
const geminiRouter = require('./routes/geminiRouter');

const logMiddleware = require('./middlewares/logsMiddlewares.js'); // Middleware de logs

const app = express(); // Initialisation de l'application

// 📡 Connexion à MongoDB
connectToMongoDb();


const logMiddleware = require('./middlwares/logsMiddlwares.js'); // Middleware de logs
const Message = require('./models/messageModels.js');

// Initialisation de l'application
const app = express();

// 📡 Connexion à MongoDB
connectToMongoDb();


// 🛠️ Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 🌐 Middleware CORS
app.use(cors({
  origin: "http://localhost:3000", // Remplacez par l'URL de votre frontend
  methods: "GET,POST,PUT,DELETE",
}));

// 🔒 Middleware de session
app.use(session({
  secret: "net secret pfe",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Utilisez `true` si vous êtes en HTTPS
    maxAge: 24 * 60 * 60 * 1000, // Durée de vie en millisecondes
  },
}));

// 📝 Middleware de logs
app.use(logMiddleware);

// 🔗 Routes (toutes sous /api maintenant ✅)
const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const osRouter = require('./routes/osRouter');
const sessionsRouter = require('./routes/sessionsRouter');
const geminiRouter = require('./routes/geminiRouter');
const messagesRouter = require('./routes/messagesRouter');



app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/os', osRouter);
app.use('/api/sessions', sessionsRouter); // Sessions = groupes
app.use('/api/gemini', geminiRouter);
app.use('/api/messages', messagesRouter);

// 🧱 Catch 404
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not Found',
  });
});

// ❌ Gestion des erreurs
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

// Configuration du serveur HTTP
const server = http.createServer(app);

// Configuration de Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('🟢 Un utilisateur est connecté :', socket.id);

  // Rejoindre un groupe
  socket.on('joinGroup', (groupName) => {
    if (groupName === 'etudiants' || groupName === 'etudiants-enseignants') {
      socket.join(groupName);
      console.log(`Utilisateur ${socket.id} a rejoint le groupe : ${groupName}`);
    } else {
      console.log(`Groupe inconnu : ${groupName}`);
    }
  });

  // Recevoir un message et le diffuser
  socket.on('sendMessage', async ({ groupName, sender, message }) => {
    try {
      const newMessage = new Message({ groupName, sender, message });
      await newMessage.save();
      io.to(groupName).emit('receiveMessage', { sender, message });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error.message);
    }
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('🔴 Un utilisateur s\'est déconnecté :', socket.id);
  });
});

// 🚀 Lancer le serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
