const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
// analyseur du corps de la req. Enregistre un middleware. Analyse en premier le coprs de la req
app.use(express.static(path.join(__dirname, "public")));
// middleware lecture seul
app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, ".", "views", "404.html"));
});

app.listen(8080);
