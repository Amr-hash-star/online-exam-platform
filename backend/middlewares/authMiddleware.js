const jwt = require('jsonwebtoken');
const User = require('../models/User');


const authenticate = async (req, res, next) => {
  console.log('🧾 Authorization header:', req.headers['authorization']);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("❌ Aucun token ou format incorrect");
    return res.status(401).json({ message: 'Token manquant ou invalide.' });
  }

  const token = authHeader.split(' ')[1];
  console.log("🔑 Token reçu :", token);

  try {
    console.log("🧪 Clé JWT utilisée :", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token décodé :", decoded);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      console.log("❌ Utilisateur non trouvé pour l'ID :", decoded.userId);
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    req.user = {
      id: user._id,
      role: user.typeUtilisateur,
      email: user.email
    };
    console.log("✅ Utilisateur authentifié :", req.user);

    console.log("✅ Authentification réussie pour :", user.email);
    next();
  } catch (error) {
    console.error("❌ Erreur de vérification du token :", error.message);
    res.status(401).json({ message: 'Token invalide.' });
  }
};

module.exports = authenticate;