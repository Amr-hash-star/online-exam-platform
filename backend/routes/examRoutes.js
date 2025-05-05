const express = require('express');
const router = express.Router();
const { createExam, getAllExams, getExamByCode } = require('../controllers/examController');
const Exam = require('../models/Exam'); // ✅ nécessaire pour la nouvelle route

// POST /api/exams/create
router.post('/create', createExam);

// GET /api/exams/
router.get('/', getAllExams);

// ✅ Nouvelle route pour récupérer un examen via son code (lienAcces)
router.get('/code/:code', getExamByCode);  

module.exports = router;