const express = require("express");
const path = require("path");
const router = express.Router();
// mini app express liée à express
const products = [];
// /admin/add-product
router.get("/add-product", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "add-product.html"));
});
router.post("/add-product", (req, res) => {
  // console.log(req.body);
  //   undefined car req donne la ppt de corps body, mais par défaut req n'analyse pas le corps il fautun parser(analyseur) => { titre: 'aso' }

  res.redirect("/");
});

module.exports = router;
// module.exports = products;
