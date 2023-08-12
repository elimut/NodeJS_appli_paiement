const express = require("express");
const router = express.Router();
// mini app express liée à express
const adminController = require("../controllers/admin");
// /admin/add-product accès page
router.get("/add-product", adminController.getAddProduct);
// ref à la fonction getAdd pas de parenthèses, express doit prendre cette fonction et la stocker puis dmd de page l'exécuter
// /admin/add-product ajout produit
router.post("/add-product", adminController.postAddproduct);
// /admin/products accès page produits
router.get("/products", adminController.getProducts);
// admin edit product
router.get("/edit-product/:productId", adminController.getEditProduct);
// admin update product
router.post("/edit-product/");

module.exports = router;
// module.exports = products;
// exports.routes = router;
