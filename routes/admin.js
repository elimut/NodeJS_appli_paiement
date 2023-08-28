const express = require("express");
const router = express.Router();
// mini app express liée à express
const { body } = require("express-validator");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

// /admin/add-product accès page
router.get("/add-product", isAuth, adminController.getAddProduct);
// ref à la fonction getAdd pas de parenthèses, express doit prendre cette fonction et la stocker puis dmd de page l'exécuter
// /admin/add-product ajout produit
router.post(
  "/add-product",
  [
    body(
      "title",
      `Le titre doit contenir au minimum 3 caratères, et ne contenir que des lettres.`
    )
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("description", `La description doit faire entre 6 et 400 caractères.`)
      .isLength({ min: 6, max: 400 })
      .trim(),
    body("price").isFloat(),
  ],
  isAuth,
  adminController.postAddproduct
);
// /admin/products accès page produits
router.get("/products", isAuth, adminController.getProducts);
// admin edit product
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
// admin update product
router.put(
  "/edit-product/",
  [
    body(
      "title",
      `Le titre doit contenir au minimum 3 caratères, et ne contenir que des lettres.`
    )
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("description", `La description doit faire entre 6 et 400 caractères.`)
      .isLength({ min: 6, max: 400 })
      .trim(),
    body("price").isFloat(),
  ],
  isAuth,
  adminController.postEditProduct
);
// admin delete product
router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
