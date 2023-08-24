const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

// Récupération des modules pour définir les routes
router.get("/", shopController.getIndex);
// get page accueil /
router.get("/products", shopController.getProducts);
// gel products's list /products
router.get("/products/:productId", shopController.getProduct);
// get details of product /products/:productId
router.get("/cart", isAuth, shopController.getCart);
// access cart /cart
router.post("/cart", isAuth, shopController.postCart);
// add product on cart /cart
router.delete(
  "/cart-delete-item",
  isAuth,
  shopController.postCartDeleteProduct
);
// delete cart's product
router.post("/create-order", isAuth, shopController.postOrder);
// btn commander on cart to store cartItems in orderItems /create-order
router.get("/orders", isAuth, shopController.getOrders);
//  access commands /orders

module.exports = router;
