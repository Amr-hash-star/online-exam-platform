const mongoose = require('mongoose');

const soumissionSchema = new mongoose.Schema({
  etudiant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  reponses: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      },
      reponse: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Soumission', soumissionSchema);