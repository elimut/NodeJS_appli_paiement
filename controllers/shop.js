// import models product and cart to use methods
const Product = require("../models/product");
const Cart = require("../models/cart");

// get all products  /products page article
exports.getProducts = (req, res) => {
  Product.fetchAll()
    // we got a nested array, we use destructuring to extract data of valur receive in args
    // anonyme fonction will be execute when we get data
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "Articles",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

// Get détails product  /products/:productId
exports.getProduct = (req, res) => {
  // productId extract from hidden input in view product ejs
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product]) =>
      res.render("shop/product-detail", {
        // fonction return an array but view expect just one object => [0]
        product: product[0],
        prods: product,
        pageTitle: "Détail de l'article",
        path: "/products",
      })
    )
    .catch((err) => console.log(err));
};

// get All products page accueil /
exports.getIndex = (req, res) => {
  // fetcAll return a promise
  Product.fetchAll()
    // we got a nested array, we use destructuring to extract data of valur receive in args
    // anonyme fonction will be execute when we get data
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "Boutique",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      // no product in  cart => []
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        // extract cart's product from cart
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        pageTitle: "Panier",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};
// get panier

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  // search product by id set in URL
  Product.findById(prodId, (product) => {
    // product receive by search in BDD to post into cart
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res) => {
  // extract id of product we want to delete in cart
  const prodId = req.body.productId;
  // obtention product' informations (price) to update cart
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    pageTitle: "Paiement",
    path: "/checkout",
  });
};
// get page paiement

exports.getOrders = (req, res) => {
  res.render("shop/orders", {
    pageTitle: "Commande",
    path: "/orders",
  });
};
// get page paiement
