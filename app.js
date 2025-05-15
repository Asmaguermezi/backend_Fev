require('dotenv').config(); // 🔐 Lire les variables .env

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

const logMiddleware = require('./middlewares/logsMiddlewares.js'); // Correction du chemin pour logsMiddlwares
const Message = require('./models/messageModels.js'); // Vérification du chemin pour messageModels

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const osRouter = require('./routes/osRouter');
const sessionsRouter = require('./routes/sessionsRouter');
const geminiRouter = require('./routes/geminiRouter');
const messagesRouter = require('./routes/messagesRouter');
const notificationsRouter = require('./routes/notificationsRouter');
const matieresRouter = require('./routes/matieresRouter.js');


const app = express(); // Initialisation de l'application

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
  origin: "http://localhost:3000", // URL du frontend
  methods: "GET,POST,PUT,DELETE",
}));

// 🔒 Middleware de session
app.use(session({
  secret: "net secret pfe",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Utilisez `true` si HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 heures
  },
}));

// 📝 Middleware de logs
app.use(logMiddleware);

// 🔗 Routes (API)
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/os', osRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/gemini', geminiRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/matieres', matieresRouter);

// 🧱 Catch 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// ❌ Gestion des erreurs
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});

// 🚀 Serveur HTTP
const server = http.createServer(app);

// 🔥 Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('🟢 Utilisateur connecté :', socket.id);

  socket.on('joinGroup', (groupName) => {
    if (groupName === 'etudiants' || groupName === 'etudiants-enseignants') {
      socket.join(groupName);
      console.log(`Utilisateur ${socket.id} a rejoint : ${groupName}`);
    } else {
      console.log(`Groupe inconnu : ${groupName}`);
    }
  });

  socket.on('sendMessage', async ({ groupName, sender, message }) => {
    try {
      const newMessage = new Message({ groupName, sender, message });
      await newMessage.save();
      io.to(groupName).emit('receiveMessage', { sender, message });
    } catch (error) {
      console.error("Erreur message :", error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Utilisateur déconnecté :', socket.id);
  });
});

// 🚀 Lancer serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
