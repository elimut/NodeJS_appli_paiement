// import models product and cart to use methods
const Product = require("../models/product");
const Cart = require("../models/cart");

// Get all products  /products page article
exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
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
  // Product.findAll({ where: { id: prodId } })
  //   // return an array with a lot of element. Interesting by first element
  //   .then((products) => {
  //     console.log(products);
  //     res.render("shop/product-detail", {
  //       product: products[0],
  //       pageTitle: `Détails de l'article ${products[0].title}`,
  //       path: "/products",
  //     });
  //   });
  Product.findByPk(prodId)
    .then((product) =>
      res.render("shop/product-detail", {
        product: product,
        pageTitle: `Détails de l'article ${product.title}`,
        path: "/products",
      })
    )
    .catch((err) => console.log(err));
};

// Get All products page accueil /
exports.getIndex = (req, res) => {
  Product.findAll()
    // reach array of products
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Boutique",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

// Get page panier /cart
// use cart associate at connected user to get & render cart
exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            pageTitle: "Panier",
            path: "/cart",
            products: products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  // search product by id set in URL
  Product.findByPk(prodId, (product) => {
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
