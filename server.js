
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
