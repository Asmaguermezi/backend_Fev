require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { connectToMongoDb } = require('./config/db');

const logMiddleware = require('./middlewares/logsMiddlewares.js');
const Message = require('./models/messageModels.js');

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const osRouter = require('./routes/osRouter');
const sessionsRouter = require('./routes/sessionsRouter');
const geminiRouter = require('./routes/geminiRouter');
const messagesRouter = require('./routes/messagesRouter');
const notificationsRouter = require('./routes/notificationsRouter');
const matieresRouter = require('./routes/matieresRouter.js');
const statsRouter = require('./routes/statsRouter.js');
const app = express();

// Connexion à MongoDB
connectToMongoDb();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/files", express.static(path.join(__dirname, "public/files")));

// CORS pour frontend
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Logs personnalisés
app.use(logMiddleware);

// Routes API
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/os', osRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/gemini', geminiRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/matieres', matieresRouter);
app.use('/api/stats', statsRouter);
// Gestion 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Gestion erreurs
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

// Serveur HTTP
const server = http.createServer(app);

// ⚡ Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
});

// 🔌 Socket.IO handlers
io.on('connection', (socket) => {
  console.log('🟢 Utilisateur connecté :', socket.id);

  // 💬 Chat par session
  socket.on('joinGroup', (sessionId) => {
    if (sessionId) {
      socket.join(sessionId);
      console.log(`Utilisateur ${socket.id} a rejoint la session : ${sessionId}`);
    } else {
      console.log(`❌ Session ID manquant`);
    }
  });

  socket.on('sendMessage', async ({ sessionId, sender, message }) => {
    try {
      const newMessage = new Message({ sessionId, sender, message });
      await newMessage.save();

      io.to(sessionId).emit('receiveMessage', {
        _id: newMessage._id,
        sender: newMessage.sender,
        message: newMessage.message,
        timestamp: newMessage.timestamp,
      });
    } catch (error) {
      console.error("❌ Erreur message :", error.message);
    }
  });

  // 🎥 Visio WebRTC multi-users + gestion des participants
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    console.log(`📹 Utilisateur ${userId} a rejoint la visio : ${roomId}`);

    // 🔔 Notifier les autres utilisateurs
    socket.to(roomId).emit("user-connected", userId);
    socket.to(roomId).emit("user-joined", userId);

    // ✅ Envoyer la liste des participants
    const participants = getUsersInRoom(roomId);
    io.to(roomId).emit("update-participants", participants);

    socket.on("disconnect", () => {
      console.log(`🔴 ${userId} a quitté la visio`);
      socket.to(roomId).emit("user-disconnected", userId);

      const updated = getUsersInRoom(roomId);
      io.to(roomId).emit("update-participants", updated);
    });
  });
});

// ✅ Fonction utilitaire : liste des sockets d'une room
function getUsersInRoom(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  return room ? Array.from(room) : [];
}

// Permet d’accéder à io dans les contrôleurs
app.set("io", io);

// Lancement serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
