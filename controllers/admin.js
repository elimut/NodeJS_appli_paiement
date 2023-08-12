const Product = require("../models/product");
exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Ajout d'articles",
    path: "/admin/add-product",
    editing: false,
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

exports.getEditProduct = (req, res) => {
  // verification if req have an object (edit:key), l'on obtiendra la valeur souhaitée:
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  // Fetch product id to fecth product to edit (pre populatng form)
  const prodId = req.params.productId;
  // Use Product model to find product associate to the id with callback for the product to render the page
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edition d'articles",
      path: "/admin/edit-product",
      // edition if req's parameter
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res) => {};
// cosntruire et remplacer le produit existant

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Articles",
      path: "/admin/products",
    });
  });
};
