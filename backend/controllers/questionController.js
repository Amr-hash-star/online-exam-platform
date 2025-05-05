const mongoose = require('mongoose');
const Question = require('../models/Question');

const createQCM = async (req, res) => {
  try {
    const { examId, enonce, options, bonnesReponses, note, duree } = req.body;
    const media = req.file ? req.file.path : null; // ✅ récupérer le chemin du fichier

    const question = new Question({
      examId,
      type: 'qcm',
      enonce,
      media,
      options: JSON.parse(options),
      bonnesReponses: JSON.parse(bonnesReponses),
      note,
      duree
    });

    await question.save();

    res.status(201).json({ message: 'QCM créé avec succès', question });
  } catch (error) {
    console.error('Erreur dans createQCM:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Fonction manquante : récupération des questions par examId
const getQuestionsByExam = async (req, res) => {
  try {
    let examId = req.params.examId;

    // Vérification si examId est valide, sinon chercher via lienAcces
    if (!mongoose.Types.ObjectId.isValid(examId)) {
      const Exam = mongoose.connection.collection('examen');
      const exam = await Exam.findOne({ lienAcces: { $regex: examId + '$' } });

      if (!exam) {
        return res.status(404).json({ message: 'Examen introuvable' });
      }
      examId = exam._id;
    }

    const questions = await Question.find({ examId: new mongoose.Types.ObjectId(examId) });
    res.status(200).json(questions);
  } catch (error) {
    console.error('Erreur lors de la récupération des questions :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { createQCM, getQuestionsByExam };