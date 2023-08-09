const express = require("express");
const router = express.Router();
const path = require("path");
// module chemin pour sendFile

router.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "shop.html"));
  //   concat des différents segments du chemin __dirname var globale node qui contient le chemin absolu du système d'exploitatioon vers ce dossier de projet détecte l'os pour faire le chemin
});

module.exports = router;
