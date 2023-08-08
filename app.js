const http = require("http");
// import module http intégré dans NodeJs

const express = require("express");
const app = express();
// create app d'express, exécution de la fonction apportée par express , cela initialise un nouvel objet. Gestionnaire de requêtes

const server = http.createServer(app);

server.listen(8080);
