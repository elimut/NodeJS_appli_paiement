const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");

// Récupération des modules pour définir les routes
router.get("/", shopController.getIndex);
// get page accueil /
router.get("/products", shopController.getProducts);
// gel products's list /products
router.get("/products/:productId", shopController.getProduct);
// get details of product /products/:productId
router.post("/cart", shopController.postCart);
// add product on cart /cart
router.get("/cart", shopController.getCart);
// access cart /cart
router.post("/cart-delete-item", shopController.postCartDeleteProduct);
// delete cart's product
router.post("/create-order", shopController.postOrder);
// btn commander on cart to store cartItems in orderItems /create-order
router.get("/orders", shopController.getOrders);
//  access commands /orders

module.exports = router;
