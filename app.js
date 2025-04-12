require('dotenv').config(); // 🔐 Pour lire les variables du fichier .env

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const cors = require('cors');
const session = require('express-session');
const { connectToMongoDb } = require('./config/db'); // 📦 Connexion MongoDB

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const osRouter = require('./routes/osRouter');
const sessionsRouter = require('./routes/sessionsRouter');
const geminiRouter = require('./routes/geminiRouter');
<<<<<<< HEAD
const logMiddleware = require('./middlewares/logsMiddlewares.js'); // Middleware de logs

const app = express(); // Initialisation de l'application

// 📡 Connexion à MongoDB
connectToMongoDb();

=======
const logMiddleware = require('./middlwares/logsMiddlwares.js'); // Middleware de logs





const app = express(); // Initialisation de l'application

// 📡 Connexion à MongoDB
connectToMongoDb();

>>>>>>> d93939d ( création du projet backend)
// 🛠️ Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 🌐 Middleware CORS
app.use(cors({
  origin: "http://localhost:3000",
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

// 🔗 Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/os', osRouter);
app.use('/sessions', sessionsRouter);
app.use('/gemini', geminiRouter);

// 🧱 Catch 404
app.use(function (req, res, next) {
  res.status(404).json({
    message: 'Not Found',
  });
});

// ❌ Gestion des erreurs
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

// 🚀 Lancer le serveur
const PORT = process.env.PORT || 5000; // Utilisation de la variable d'environnement PORT
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});