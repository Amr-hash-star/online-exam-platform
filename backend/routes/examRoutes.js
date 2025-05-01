const express = require('express');
const router = express.Router();
const { createExam, getAllExams } = require('../controllers/examController');

// POST /api/exams/create
router.post('/create', createExam);


// GET /api/exams/
router.get('/', getAllExams);


module.exports = router;