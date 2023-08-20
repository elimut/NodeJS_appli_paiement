// import product's model
const Product = require("../models/product");

//Page admin ajout produit GET /admin/add-product
exports.getAddProduct = (req, res) => {
  // reach page
  res.render("admin/edit-product", {
    pageTitle: "Ajout d'articles",
    path: "/admin/add-product",
    // if editing false get add product form if true we get update product form => views ejs edit-product
    editing: false,
  });
};

// Page admin ajout de produit POST new product /admin/add-product
exports.postAddproduct = (req, res) => {
  // store attriubte of table in body req
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  // use object user in req (store in app.js) and method to create an associate product proprosed by sequelize with associations
  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
    // userId: req.user,
  });
  product
    .save()
    .then((_) => {
      console.log("Created product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

// Get product to update with btn modifier page /admin/edit-product
exports.getEditProduct = (req, res) => {
  // Verify if req have an object (edit:key):
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  // Fetch product id to fecth product to edit (pre populatng form)
  const prodId = req.params.productId;
  // Use Product model to find product associate to the id for the product to render the page
  // reach page only for user connected
  req.user
    // fetch product to edit
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then((products) => {
      // receive an array, to see the propertys of product to edit we need to specify we want the first element of this array
      const product = products[0];
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
    })
    .catch((err) => console.log(err));
};

// Put product page /admin/edit-product/:id?edit=true
exports.postEditProduct = (req, res) => {
  // Fetch informations to the product we want to updated. (need an input in view edit-product to store existing product's id )
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedPrice = req.body.price;
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      product.price = updatedPrice;
      // sequelize method to save in bdd. Return to return promise of save()
      return product.save();
    })
    // promise for save
    .then((result) => {
      console.log("Produit mis à jour");
      // to redirect when promise is finished, async
      res.redirect("/admin/products");
    })
    // catch for all code
    .catch((err) => console.log(err));
};

// Get all products page gestion admin produit /admin/products
exports.getProducts = (req, res) => {
  // find products for the user connected
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Articles",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

// Delete product /admin/product/:id
exports.postDeleteProduct = (req, res) => {
  // extract prod id to delete from the request body
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      // return a promise
      return product.destroy();
    })
    .then((result) => {
      console.log("Produit supprimé!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
