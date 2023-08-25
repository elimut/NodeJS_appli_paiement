// import product's model
const Product = require("../models/product");

const { validationResult } = require("express-validator");

//Page admin ajout produit GET /admin/add-product
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Ajout d'articles",
    path: "/admin/add-product",
    // if editing false get add product form if true we get update product form => views ejs edit-product
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

// Page admin ajout de produit POST new product /admin/add-product
exports.postAddproduct = (req, res, next) => {
  // store attriubte of table in body req
  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;
  const price = req.body.price;
  const userId = req.sessionUser.id;
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Ajout d'articles",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        description: description,
        price: price,
        userId: userId,
      },
      errorMessage: `Le fichier n'est pas au format souhaité (.png, .jpg, .jpeg)`,
      validationErrors: [],
    });
  }
  // to store path of image in file store before
  const imageUrl = image.path;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Ajout d'articles",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
        userId: userId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  // use object user in req (store in app.js) and method to create an associate product proprosed by sequelize with associations
  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
    userId: userId,
  });
  product
    .save()
    .then((_) => {
      console.log("Created product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};

// Get product to update with btn modifier page /admin/edit-product
exports.getEditProduct = (req, res, next) => {
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
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};

// Put product page /admin/edit-product/:id?edit=true
exports.postEditProduct = (req, res, next) => {
  // Fetch informations to the product we want to updated. (need an input in view edit-product to store existing product's id )
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedDesc = req.body.description;
  const updatedPrice = req.body.price;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Modification d'articles",
      path: "/admin/edit-product",
      // if editing false get add product form if true we get update product form => views ejs edit-product
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        description: updatedDesc,
        price: updatedPrice,
        id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  Product.findByPk(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user.id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      // if image updated, else not changed image in db
      if (image) {
        product.imageUrl = image.path;
      }
      product.description = updatedDesc;
      product.price = updatedPrice;
      // sequelize method to save in bdd. Return to return promise of save()
      return product
        .save() // promise for save
        .then((result) => {
          // to redirect when promise is finished, async
          res.redirect("/admin/products");
        });
    })
    // catch for all code
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  // access only create user for products
  Product.findAll({ where: { userId: req.user.id } })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Articles",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};

// Delete product /admin/product/:id
exports.postDeleteProduct = (req, res, next) => {
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};
