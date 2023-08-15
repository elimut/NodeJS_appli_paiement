// import product's model
// import product's model
const Product = require("../models/product");

//Page admin ajout produit GET /admin/add-product
exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Ajout d'articles",
    path: "/admin/add-product",
    // if editing false get add product form if true we get update product form => views ejs edit-product
    editing: false,
  });
};

// Page admin ajout de produit POST new product /admin/add-product
exports.postAddproduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  // null for id because if we added a new product id his not define
  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    // redirect only when insertion is finished
    .then(res.redirect("/"))
    .catch((err) => console.log(err));
};

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

exports.postEditProduct = (req, res) => {
  // Fetch informations to the product we want to updated. (need an input in view edit-product to store existing product's id )
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedPrice = req.body.price;
  // Create a new product instance (product updated) with new informations and call save() of product's model
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  // call save method to save new instance with updated information's product
  updatedProduct.save();
  res.redirect("/admin/products");
};
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

exports.postDeleteProduct = (req, res) => {
  // extract prod id to delete from the request body
  const prodId = req.body.productId;
  console.log(prodId);

  Product.deleteById(prodId);
  res.redirect("/admin/products");
};
