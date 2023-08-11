const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);
// Route vers accueil /
router.get("/products", shopController.getProducts);
// liste de produits /products
router.get("/products/:productId", shopController.getProduct);
// afficher les détails d'un livre /products/:productId
router.post("/cart", shopController.postCart);
// post panier /cart
router.get("/cart", shopController.getCart);
//panier /cart
router.get("/checkout", shopController.getCheckout);
//paiement /checkout
router.get("/orders", shopController.getOrders);
//commandes /orders

module.exports = router;
