const express = require('express');
const router = express.Router();
const {
  createExam,
  getAllExams,
  getExamByCode,
  enregistrerGeolocalisation, //  nouvelle fonction contrôleur
  getResultatEtudiant
} = require('../controllers/examController');
const Exam = require('../models/Exam'); // ✅ nécessaire pour la nouvelle route
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/exams/create
router.post('/create', createExam);

// GET /api/exams/
router.get('/', getAllExams);

// ✅ Nouvelle route pour récupérer un examen via son code (lienAcces)
router.get('/code/:code', getExamByCode);

// ✅ Nouvelle route pour enregistrer la géolocalisation d’un étudiant
router.post('/geolocalisation', authMiddleware, enregistrerGeolocalisation);

console.log(" Route GET /api/exams/resultat chargée");
router.get('/resultat', authMiddleware, getResultatEtudiant);

router.get('/test', (req, res) => {
  res.json({ message: "✅ Route test OK" });
});

// Nouvelle route pour enregistrer les réponses d'un étudiant
router.post('/submit', authMiddleware, require('../controllers/examController').enregistrerSoumission);


module.exports = router;