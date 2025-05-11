const Exam = require('../models/Exam');
const Soumission = require('../models/Soumission');
const Question = require('../models/Question');

// 🔧 Fonction de distance de Levenshtein pour les questions à tolérance
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[a.length][b.length];
}

// Création d’un examen
exports.createExam = async (req, res) => {
  try {
    const { titre, description, publicCible } = req.body;
    const lienUnique = `${req.protocol}://${req.get('host')}/exam/${Date.now().toString(36)}`;
    const newExam = new Exam({ titre, description, publicCible, lienAcces: lienUnique });
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
    const exam = await Exam.findOne({ lienAcces: { $regex: `${code}$` } });

    if (!exam) {
      return res.status(404).json({ message: 'Examen introuvable' });
    }

    res.status(200).json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la recherche de l\'examen', error: err.message });
  }
};

// ✅ Enregistrer la géolocalisation
exports.enregistrerGeolocalisation = async (req, res) => {
  try {
    const { examId, latitude, longitude } = req.body;
    const userId = req.user._id;

    if (!examId || !latitude || !longitude) {
      return res.status(400).json({ message: 'Données géographiques ou ID manquants.' });
    }

    console.log(`Étudiant ${userId} localisé : [${latitude}, ${longitude}] pour examen ${examId}`);
    res.status(200).json({ message: 'Coordonnées enregistrées avec succès.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement des coordonnées', error: err.message });
  }
};

// ✅ Calcul du résultat de l’étudiant (corrigé)
exports.getResultatEtudiant = async (req, res) => {
  const userId = req.user.id;

  try {
    const lastSubmission = await Soumission.findOne({ etudiant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'reponses.questionId',
        model: 'Question'
      });

    if (!lastSubmission) {
      return res.status(404).json({ message: 'Aucune soumission trouvée pour cet utilisateur.' });
    }

    console.log("🔍 Liste des questions récupérées :", lastSubmission.reponses);

    // 🔁 Supprimer les doublons de questions (par leur ID)
    const vues = new Set();
    const reponsesUniques = [];

    for (const rep of lastSubmission.reponses) {
      const questionId = rep.questionId._id.toString(); // S'assurer que c'est une string
      if (!vues.has(questionId)) {
        vues.add(questionId);
        reponsesUniques.push(rep);
      }
    }

    let scoreTotal = 0;
    let scoreMax = 0;

    for (const rep of reponsesUniques) {
      const question = rep.questionId;
      const reponseEtudiant = rep.reponse;

      if (!question || !question.note) continue;
      if (!reponseEtudiant || reponseEtudiant.trim() === "") {
        console.log(`⚠️ Aucune réponse donnée pour la question : ${question.enonce}`);
        continue; // Ne pas prendre en compte cette question
      }

      scoreMax += question.note;

      if (question.type === 'qcm') {
        const bonneReponse = String(question.bonnesReponses[0]).trim().toLowerCase();
        const reponse = String(reponseEtudiant).trim().toLowerCase();

        console.log("🔎 Question:", question.enonce);
        console.log("🔎 Réponse étudiant:", reponseEtudiant);
        console.log("🔎 Bonne réponse attendue :", bonneReponse);

        if (reponse === bonneReponse) {
          scoreTotal += question.note;
        }

      } else if (question.type === 'directe') {
        const bonneReponse = String(question.reponseDirecte).trim().toLowerCase();
        const reponse = reponseEtudiant.trim().toLowerCase();
        const tolerance = question.tolerance || 0;

        const difference = levenshtein(bonneReponse, reponse);
        console.log("🔎 Question:", question.enonce);
        console.log("🔎 Réponse étudiant:", reponseEtudiant);
        console.log("🔎 Bonne réponse attendue :", bonneReponse);
        console.log(`🧮 Distance entre "${bonneReponse}" et "${reponse}" :`, difference);

        if (difference <= tolerance && difference < bonneReponse.length) {
          scoreTotal += question.note;
        }
        console.log(`⚖️ Comparaison tolérante : "${reponse}" vs "${bonneReponse}" → distance ${difference}, tolérance ${tolerance}`);
      }
    }

    const scoreSur100 = scoreMax > 0 ? Math.round((scoreTotal / scoreMax) * 100) : 0;
    console.log("🔍 ScoreTotal:", scoreTotal);
    console.log("🔍 ScoreMax:", scoreMax);
    console.log("🧮 Score final:", scoreSur100);

    res.json({ score: scoreSur100 });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur interne.' });
  }
};

// ✅ Enregistrer la soumission d’un étudiant
exports.enregistrerSoumission = async (req, res) => {
  const userId = req.user.id;
  console.log("🧐 ID utilisateur récupéré :", userId);

  const { examId, reponses } = req.body;
  if (!examId || !Array.isArray(reponses)) {
    return res.status(400).json({ message: 'Données manquantes ou mal formatées.' });
  }

  try {
    const nouvelleSoumission = new Soumission({
      etudiant: userId,
      exam: examId,
      reponses
    });

    await nouvelleSoumission.save();

    res.status(201).json({ message: 'Soumission enregistrée avec succès.' });
  } catch (err) {
    console.error('Erreur lors de la soumission :', err);
    res.status(500).json({ message: 'Erreur lors de la soumission.' });
  }
};
