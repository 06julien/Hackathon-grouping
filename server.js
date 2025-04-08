const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

let students = [];

app.post("/api/register", (req, res) => {
  const { nom, prenom, filiere, competence } = req.body;
  students.push({ nom, prenom, filiere, competence });
  res.status(200).send("Inscription enregistrée");
});

app.get("/api/groups", (req, res) => {
  const shuffled = [...students].sort(() => 0.5 - Math.random());
  const groups = [];

  while (shuffled.length > 0) {
    const group = [];
    const usedSkills = new Set();

    for (let i = 0; i < shuffled.length && group.length < 4; i++) {
      const student = shuffled[i];
      if (!usedSkills.has(student.competence)) {
        group.push(student);
        usedSkills.add(student.competence);
        shuffled.splice(i, 1);
        i--;
      }
    }

    // Si groupe incomplet, remplir avec aléatoire
    while (group.length < 4 && shuffled.length > 0) {
      group.push(shuffled.pop());
    }

    groups.push(group);
  }

  res.json(groups);
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

const express = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour analyser les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Remplace ces valeurs par celles que tu obtiens dans ton projet Google Cloud
const sheets = google.sheets("v4");
const apiKey = "AIzaSyDFPpX3OOB_aWLeEY0pjofgxl8SlvuMIcU"; // Remplace avec ta clé API
const spreadsheetId =
  "https://docs.google.com/spreadsheets/d/1F0DZCw9fBWt4Y0yJ6EVc2EoDNW6_HywCARt3NgHfiTI/edit?usp=sharing"; // L'ID de ton Google Sheet (tu peux l'extraire de l'URL)

const auth = new google.auth.GoogleAuth({
  apiKey: apiKey,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Endpoint pour traiter le formulaire et envoyer les données
app.post("/submit-form", async (req, res) => {
  const { name, prenom, filliere, competence } = req.body;

  const request = {
    spreadsheetId: spreadsheetId,
    range: "Sheet1!A1", // Assure-toi que "Sheet1" est bien le nom de ta feuille
    valueInputOption: "RAW",
    resource: {
      values: [[name, prenom, filliere, competence]],
    },
    auth: auth,
  };

  try {
    const response = await sheets.spreadsheets.values.append(request);
    res.status(200).send("Données envoyées avec succès !");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de l'envoi des données.");
  }
});

app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});
