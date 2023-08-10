const express = require("express");
const router = express.Router();
// module chemin pour
const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);
// accueil
router.get("/products", shopController.getProducts);
// liste de produits
router.get("/cart", shopController.getCart);
//panier
router.get("/checkout", shopController.getCheckout);
//paiment

module.exports = router;
