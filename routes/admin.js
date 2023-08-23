const express = require("express");
const router = express.Router();
// mini app express liée à express

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

// /admin/add-product accès page
router.get("/add-product", isAuth, adminController.getAddProduct);
// ref à la fonction getAdd pas de parenthèses, express doit prendre cette fonction et la stocker puis dmd de page l'exécuter
// /admin/add-product ajout produit
router.post("/add-product", isAuth, adminController.postAddproduct);
// /admin/products accès page produits
router.get("/products", isAuth, adminController.getProducts);
// admin edit product
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
// admin update product
router.post("/edit-product/", isAuth, adminController.postEditProduct);
// admin delete product
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
// module.exports = products;
// exports.routes = router;
