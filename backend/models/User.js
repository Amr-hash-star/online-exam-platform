// Importation de mongoose pour la création du modèle
const mongoose = require('mongoose');

// Définition du schéma utilisateur (structure dans la base MongoDB)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true, // Supprimer les espaces inutiles
  },
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  prenom: {
    type: String,
    required: true,
    trim: true,
  },
  dateNaissance: {
    type: Date,
    required: true,
  },
  sexe: {
    type: String,
    required: true,
    enum: ['Homme', 'Femme'], // Restriction des valeurs acceptées
  },
  etablissement: {
    type: String,
    required: true,
    trim: true,
  },
  filiere: {
    type: String,
    required: true,
    trim: true,
  },
  typeUtilisateur: {
    type: String,
    required: true,
    enum: ['Etudiant', 'Enseignant'],
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // timestamps ajoute createdAt et updatedAt automatiquement

// Création du modèle basé sur ce schéma
const User = mongoose.model('User', userSchema);

// Exportation du modèle pour pouvoir l'utiliser ailleurs
module.exports = User;