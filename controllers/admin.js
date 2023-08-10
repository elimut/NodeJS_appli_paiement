const Product = require("../models/product");
exports.getAddProduct = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Ajout d'articles",
    path: "/admin/add-product",
    formsCss: true,
    productCss: true,
    activeAddProduct: true,
  });
};
// accès page ajout produit GET /admin/add-product

exports.postAddproduct = (req, res) => {
  // console.log(req.body);
  //   undefined car req donne la ppt de corps body, mais par défaut req n'analyse pas le corps il fautun parser(analyseur) => { titre: 'aso' }
  //   products.push({ title: req.body.title });
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};
// sur page addProduct POST new product /admin/add-product

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Articles",
      path: "/admin/products",
    });
  });
};
