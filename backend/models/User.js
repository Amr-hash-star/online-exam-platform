const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
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
    enum: ['Homme', 'Femme'],
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
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;