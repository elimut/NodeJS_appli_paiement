const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Articles",
      path: "/products",
      hasProducts: products.length > 0,
      activeShop: true,
      productCss: true,
    });
  });
  // console.log(adminData.products);
  //  données inhérentes à Node, il faut donc réussir à les partager seulement pour l'user dont vient la demande
  //   concat des différents segments du chemin __dirname var globale node qui contient le chemin absolu du système d'exploitatioon vers ce dossier de projet détecte l'os pour faire le chemin
};
// get accueil avec les prod ajoutés /

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Boutique",
      path: "/",
    });
  });
};
// get index

exports.getCart = (req, res) => {
  res.render("shop/cart", {
    pageTitle: "Panier",
    path: "/cart",
  });
};
// get panier

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    pageTitle: "Paiement",
    path: "/checkout",
  });
};
// get page paiement
