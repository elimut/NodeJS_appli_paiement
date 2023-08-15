const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const pageNotFoundController = require("./controllers/error");
// import connection bdd
const db = require("./util/database");

app.set("view engine", "ejs");
// config var globale pour pug sur notre app express lui dire où trouver le moteur de template
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
// analyseur du corps de la req. Enregistre un middleware. Analyse en premier le coprs de la req
app.use(express.static(path.join(__dirname, "public")));
// middleware lecture seul
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFoundController.get404Page);

app.listen(8080);
