// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Importation des routes d'authentification

// Chargement des variables d'environnement depuis le fichier .env
dotenv.config();

// Création d'une instance Express
const app = express();

// Middlewares
app.use(cors()); // Permet d'accepter les requêtes provenant d'autres domaines (CORS)
app.use(express.json()); // Permet de lire le corps des requêtes en JSON

// Routes d'authentification
app.use('/api/auth', authRoutes); // Toutes les routes définies dans authRoutes commencent par /api/auth

// Route de test pour vérifier si le serveur fonctionne
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, // Utiliser le nouvel analyseur d'URL de MongoDB
  useUnifiedTopology: true // Utiliser le nouveau moteur de découverte et de surveillance
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection failed:', err));

// Démarrage du serveur sur le port spécifié
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});