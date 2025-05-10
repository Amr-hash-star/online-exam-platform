// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');


// Chargement des variables d'environnement depuis le fichier .env
dotenv.config();
console.log("✅ JWT_SECRET lu depuis .env :", process.env.JWT_SECRET);


// Création d'une instance Express
const app = express();



// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);


// Pour servir les fichiers HTML du frontend
app.use(express.static(path.join(__dirname, '../frontend/public')));
// Ajout de la route spécifique pour examen.html
app.get('/examen.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/examen.html'));
  });
// Sert les fichiers uploadés (images, sons, etc.)
app.use('/uploads', express.static('uploads'));



app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/exam/:code', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/questions.html'));
});

// Vérification de l'URI lue depuis .env
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connexion à MongoDB avec options recommandées
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    
    // Démarrer le serveur seulement après connexion réussie
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });