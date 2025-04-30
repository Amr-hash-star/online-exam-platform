// =============================================
// IMPORTATION DES MODULES ET CONFIGURATION
// =============================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Pour chiffrer le mot de passe avant de l'enregistrer
const { body, validationResult } = require('express-validator'); // Pour valider les champs envoyés dans les requêtes
const jwt = require('jsonwebtoken'); // Pour créer et vérifier les tokens JWT
const User = require('../models/User'); // Le modèle d'utilisateur (MongoDB)
const authenticate = require('../middlewares/authMiddleware'); // Middleware pour protéger les routes avec JWT


// =============================================
// ROUTE POST : INSCRIPTION D'UN UTILISATEUR
// =============================================

// Cette route permet à un nouvel utilisateur de s'inscrire.
// Elle valide les champs, vérifie si l'email est déjà utilisé,
// puis enregistre le nouvel utilisateur avec un mot de passe sécurisé.

router.post('/register', [
  body('email').isEmail().withMessage('Email invalide.'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  body('nom').notEmpty().withMessage('Le nom est obligatoire.'),
  body('prenom').notEmpty().withMessage('Le prénom est obligatoire.'),
  body('dateNaissance').isDate().withMessage('La date de naissance est invalide.'),
  body('sexe').isIn(['Homme', 'Femme']).withMessage('Le sexe doit être "Homme" ou "Femme".'),
  body('etablissement').notEmpty().withMessage('L\'établissement est obligatoire.'),
  body('filiere').notEmpty().withMessage('La filière est obligatoire.'),
  body('typeUtilisateur').isIn(['Etudiant', 'Enseignant']).withMessage('Le type d\'utilisateur doit être "Etudiant" ou "Enseignant".')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nom, prenom, email, password, dateNaissance, sexe, etablissement, filiere, typeUtilisateur } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Le mot de passe est chiffré avant stockage

    const user = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      dateNaissance,
      sexe,
      etablissement,
      filiere,
      typeUtilisateur
    });

    await user.save(); // Enregistrement dans la base de données

    res.status(201).json({ message: 'Utilisateur créé avec succès.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.', error: error.message });
  }
});


// =============================================
// ROUTE POST : CONNEXION D'UN UTILISATEUR
// =============================================

// Cette route permet à un utilisateur de se connecter.
// Elle vérifie les identifiants, compare les mots de passe,
// puis retourne un token JWT s'ils sont corrects.

router.post('/login', [
  body('email').isEmail().withMessage('Email invalide.'),
  body('password').notEmpty().withMessage('Le mot de passe est obligatoire.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    const token = jwt.sign(
      { userId: user._id, typeUtilisateur: user.typeUtilisateur }, // données stockées dans le token
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Durée de vie du token
    );

    res.json({ token, message: "Connexion réussie." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la connexion.", error: error.message });
  }
});


// =============================================
// ROUTE GET : PROFIL DE L'UTILISATEUR CONNECTÉ
// =============================================

// Cette route est protégée par le middleware "authenticate".
// Elle permet de récupérer les informations du profil de l'utilisateur connecté.
// Elle nécessite un token JWT valide.

router.get('/profile', authenticate, (req, res) => {
  res.json(req.user); // L'utilisateur est déjà récupéré par le middleware
});


// =============================================
// EXPORTATION DU ROUTEUR
// =============================================

module.exports = router;