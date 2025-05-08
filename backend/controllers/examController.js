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

// Récupérer un examen via le code dans l'URL
exports.getExamByCode = async (req, res) => {
  try {
    const code = req.params.code;

    // On cherche un examen dont le lienAcces se termine par ce code
    const exam = await Exam.findOne({ lienAcces: { $regex: `${code}$` } });

    if (!exam) {
      return res.status(404).json({ message: 'Examen introuvable' });
    }

    res.status(200).json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la recherche de l\'examen', error: err.message });
  }
};

// ✅ Enregistrer la géolocalisation d’un étudiant pour un examen donné
exports.enregistrerGeolocalisation = async (req, res) => {
  try {
    const { examId, latitude, longitude } = req.body;
    const userId = req.userId; // récupéré via le middleware auth

    if (!examId || !latitude || !longitude) {
      return res.status(400).json({ message: 'Données géographiques ou ID manquants.' });
    }

    // Ici, tu peux stocker les coordonnées dans une collection dédiée, ou logger les accès
    console.log(`Étudiant ${userId} localisé : [${latitude}, ${longitude}] pour examen ${examId}`);

    // Tu peux aussi stocker ça dans MongoDB si tu as un modèle "Participation" ou autre

    res.status(200).json({ message: 'Coordonnées enregistrées avec succès.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement des coordonnées', error: err.message });
  }
};