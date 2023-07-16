require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Joueur = require('./models/Joueur');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/joueurs', async (req, res) => {
  const joueurs = await Joueur.find();
  res.json(joueurs);
});

app.post('/joueurs', async (req, res) => {
  const newJoueur = new Joueur(req.body);
  const savedJoueur = await newJoueur.save();
  res.json(savedJoueur);
});

app.get('/joueurs/:id', async (req, res) => {
  const joueur = await Joueur.findById(req.params.id);
  res.json(joueur);
});

app.put('/joueurs/:id', async (req, res) => {
  const updatedJoueur = await Joueur.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedJoueur);
});

app.delete('/joueurs/:id', async (req, res) => {
  const deletedJoueur = await Joueur.findByIdAndDelete(req.params.id);
  res.json(deletedJoueur);
});

app.listen(3000, () => console.log('Serveur lancé sur le port 3000'));
