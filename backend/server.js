const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // <-- AJOUT ICI

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Utiliser les routes d'authentification
app.use('/api/auth', authRoutes); // <-- AJOUT ICI

// Route test
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection failed:', err));

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});