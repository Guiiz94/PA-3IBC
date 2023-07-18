const mongoose = require('mongoose');

const JoueurSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // Adresse
  nom: { type: String, required: true },
  niveau: { type: Number, default: 0 },
  xp: { type: Number, default: 0 }
});

module.exports = mongoose.model('Joueur', JoueurSchema);
