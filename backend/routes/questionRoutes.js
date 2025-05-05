const express = require('express');
const router = express.Router();
const { createQCM, getQuestionsByExam } = require('../controllers/questionController');
const upload = require('../middlewares/upload'); // 📁 import multer

// Route pour la récupération des questions liées à un examen
router.get('/exam/:examId', getQuestionsByExam);

// Route pour ajouter une question de type QCM avec média
router.post('/qcm', upload.single('media'), createQCM); // ✅ ajoute middleware d'upload

module.exports = router;
