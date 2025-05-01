// controllers/loginController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Remplacé bcrypt par bcryptjs
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect." });

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.typeUtilisateur },
      'secret-key', // À remplacer en prod par une vraie clé
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Connexion réussie.",
      token,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        typeUtilisateur: user.typeUtilisateur
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};