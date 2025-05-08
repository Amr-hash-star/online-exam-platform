const express = require('express');
const router = express.Router();
const {
  createExam,
  getAllExams,
  getExamByCode,
  enregistrerGeolocalisation // ✅ nouvelle fonction contrôleur
} = require('../controllers/examController');
const Exam = require('../models/Exam'); // ✅ nécessaire pour la nouvelle route

// POST /api/exams/create
router.post('/create', createExam);

// GET /api/exams/
router.get('/', getAllExams);

// ✅ Nouvelle route pour récupérer un examen via son code (lienAcces)
router.get('/code/:code', getExamByCode);

// ✅ Nouvelle route pour enregistrer la géolocalisation d’un étudiant
router.post('/geolocalisation', enregistrerGeolocalisation);

module.exports = router;