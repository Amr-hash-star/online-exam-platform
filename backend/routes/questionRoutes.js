const express = require('express');
const router = express.Router();
const {
  createQCM,
  createDirecte,
  getQuestionsByExam,
  getQuestionsByExamId, // ✅ nouvelle fonction
  deleteQuestion,       // ✅ fonction de suppression
  updateQuestion,       // ✅ fonction de modification
  getQuestionById       // ✅ fonction pour une question précise
} = require('../controllers/questionController');

const upload = require('../middlewares/upload'); // 📁 import multer

// ✅ Route principale : récupération des questions par lien d’accès ou ID
router.get('/exam/:examId', getQuestionsByExam);

// ✅ Route alternative directe par ID simple
router.get('/by-id/:examId', getQuestionsByExamId); // 🔄 renommée pour éviter conflit

// Route pour ajouter une question de type QCM avec média
router.post('/qcm', upload.single('media'), createQCM); // ✅ ajoute middleware d'upload

// Route pour ajouter une question directe
router.post('/directe', upload.single('media'), createDirecte); // ✅ ajoute middleware d'upload

// 🗑️ Route pour supprimer une question par son ID
router.delete('/:id', deleteQuestion); // ✅ suppression d'une question

// ✏️ Route pour modifier une question par son ID
router.put('/:id', upload.single('media'), updateQuestion); // ✅ modification d'une question

// 🔍 Récupérer une question individuelle
router.get('/question/:id', getQuestionById); // 🔄 déplacée pour éviter collision avec /:examId

module.exports = router;