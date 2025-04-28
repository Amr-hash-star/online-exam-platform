const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Route d'inscription
router.post('/register', [
  // Validations
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
    // Retourner toutes les erreurs
    return res.status(400).json({ errors: errors.array() });
  }

  const { nom, prenom, email, password, dateNaissance, sexe, etablissement, filiere, typeUtilisateur } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
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

    await user.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.', error: error.message });
  }
});

module.exports = router;