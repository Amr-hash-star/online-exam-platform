const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const examSchema = new Schema({
  titre: { type: String, required: true },
  description: { type: String },
  publicCible: { type: String }, // Exemple : "2e année MIP, S4, groupe A"
  lienAcces: { type: String, unique: true, default: () => uuidv4() }, // Génère un lien unique
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', examSchema, 'examen');
