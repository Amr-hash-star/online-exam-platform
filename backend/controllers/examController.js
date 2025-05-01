// controllers/examController.js

const Exam = require('../models/Exam'); // Assure-toi que ce modèle existe

// Création d’un examen
exports.createExam = async (req, res) => {
  try {
    const { titre, description, publicCible } = req.body;

    // Génération d’un lien unique (tu peux le personnaliser)
    const lienUnique = `${req.protocol}://${req.get('host')}/exam/${Date.now().toString(36)}`;

    const newExam = new Exam({
      titre,
      description,
      publicCible,
      lienAcces: lienUnique,
    });

    await newExam.save();
    res.status(201).json(newExam);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l’examen', error: err.message });
  }
};

// Récupérer tous les examens
exports.getAllExams = async (req, res) => {
    try {
      const exams = await Exam.find();
      res.status(200).json(exams);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la récupération des examens', error: err.message });
    }
  };
  