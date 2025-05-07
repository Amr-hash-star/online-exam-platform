const mongoose = require('mongoose');
const Question = require('../models/Question');

// ✅ Créer une question de type QCM
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

// ✅ Fonction pour récupérer les questions en détectant automatiquement un lien d’accès
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

    console.log("ExamID reçu :", examId);

    const questions = await Question.find({ examId: new mongoose.Types.ObjectId(examId) });
    res.status(200).json(questions);
  } catch (error) {
    console.error('Erreur lors de la récupération des questions :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Créer une question de type directe (réponse libre)
const createDirecte = async (req, res) => {
  try {
    const { examId, enonce, reponse, tolerance, note, duree } = req.body;
    const media = req.file ? req.file.path : null;

    const question = new Question({
      examId,
      type: 'directe',
      enonce,
      media,
      reponseDirecte: reponse,
      tolerance: parseFloat(tolerance) || 0,
      note,
      duree
    });

    await question.save();

    res.status(201).json({ message: 'Question directe créée avec succès', question });
  } catch (error) {
    console.error('Erreur dans createDirecte:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ✅ Fonction alternative : récupération directe des questions par un vrai examId (sans lienAcces)
const getQuestionsByExamId = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ message: 'ID examen invalide' });
    }

    const questions = await Question.find({ examId: new mongoose.Types.ObjectId(examId) });
    res.status(200).json(questions);
  } catch (error) {
    console.error('Erreur dans getQuestionsByExamId:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// 🗑️ Supprimer une question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.status(200).json({ message: 'Question supprimée avec succès' });
  } catch (error) {
    console.error('Erreur dans deleteQuestion:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ✏️ Modifier une question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (req.file) {
      data.media = req.file.path; // ✅ mise à jour du média si nouveau fichier
    }

    if (data.options) {
      data.options = JSON.parse(data.options);
    }

    if (data.bonnesReponses) {
      data.bonnesReponses = JSON.parse(data.bonnesReponses);
    }

    if (data.tolerance) {
      data.tolerance = parseFloat(data.tolerance);
    }

    const updated = await Question.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Question non trouvée' });
    }

    res.status(200).json({ message: 'Question mise à jour', question: updated });
  } catch (error) {
    console.error('Erreur dans updateQuestion:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// 🔍 Récupérer une seule question par son ID
const getQuestionById = async (req, res) => {
    try {
      const { id } = req.params;
      const question = await Question.findById(id);
      if (!question) {
        return res.status(404).json({ message: 'Question non trouvée' });
      }
      res.status(200).json(question);
    } catch (error) {
      console.error('Erreur dans getQuestionById:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };
  

module.exports = {
  createQCM,
  createDirecte,
  getQuestionsByExam,
  getQuestionsByExamId,
  deleteQuestion,      // ✅ n'oublie pas de l’ajouter dans les routes
  updateQuestion,       // ✅ nouvelle fonction ajoutée
  getQuestionById
};