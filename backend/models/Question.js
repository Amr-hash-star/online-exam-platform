// models/Question.js

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  type: {
    type: String,
    enum: ['qcm', 'directe'],
    required: true
  },
  enonce: {
    type: String,
    required: true
  },
  media: {
    type: String // URL du fichier (image/audio/vidéo) s'il y en a
  },
  options: {
    type: [String], // Un tableau d'options (A, B, C, etc.)
    default: []
  },
  bonnesReponses: {
    type: [Number], // Indices des bonnes réponses dans le tableau options
    default: []
  },
  note: {
    type: Number,
    required: true
  },
  duree: {
    type: Number, // en secondes
    required: true
  }
});

module.exports = mongoose.model('Question', questionSchema);