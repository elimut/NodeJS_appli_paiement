const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

// Import models to use
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 2;

// Get all products  /products page article
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Articles",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};

// Get détails product  /products/:productId
exports.getProduct = (req, res, next) => {
  // productId extract from hidden input in view product ejs
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) =>
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      })
    )
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};

// Get All products page accueil /
exports.getIndex = (req, res, next) => {
  // /?page=1 query's name: page
  const page = req.query.page;

  Product.findAll()
    // reach array of products
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Boutique",
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};

// Get page panier /cart
// use cart associate at connected user to get & render cart
exports.getCart = (req, res, next) => {
  req.sessionUser
    .getCart()
    .then((cart) => {
      let user = req.sessionUser;
      if (!cart) {
        return user.createCart();
      }
      return cart.getProducts().then((products) => {
        res.render("shop/cart", {
          pageTitle: "Panier",
          path: "/cart",
          products: products,
        });
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};

// Add a new product in cart / or /products
exports.postCart = (req, res, next) => {
  // fetch id product to add
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  const user = req.sessionUser.id;
  // get cart of user
  User.findByPk(user)
    .then((userId) => {
      return userId.getCart();
    })
    .then((cart) => {
      fetchedCart = cart;
      // is the product already exist in cart to increase quantity or add product if not
      // fetch product to add
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      // verify if product exist and store in var (array need just first element of array )
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      // if have product increase quantity
      if (product) {
        // fetch old quantity with accessing to between table
        const oldQuantity = product.cartitem.quantity;

        newQuantity = oldQuantity + 1;
        // if product doesn't exist in cart, search data product to add
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      // through to tell sequelize we need key to between table cartItem
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};

// Delete product from cart /cart btn supprimer
exports.postCartDeleteProduct = (req, res, next) => {
  // extract id of product we want to delete in cart
  const prodId = req.body.productId;
  // access connected user's cart
  req.sessionUser
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      // only destroy in table cartItem
      return product.cartitem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};

// Create new command /create-order with btn commander
exports.postOrder = (req, res, next) => {
  // store cart
  let fetchedCart;
  // take all cart's products to store in order
  req.sessionUser
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      // create order for user
      return req.sessionUser.createOrder().then((order) => {
        // don't use through beacause different quantity for product. Use map to associate one product with respective field
        return order.addProducts(
          products.map((product) => {
            // transformation arry product fetch with map, to get product in order in between table to get attribute of product
            product.orderitem = { quantity: product.cartitem.quantity };
            return product;
          })
        );
      });
    })
    .then((result) => {
      // erase cart's product with set on null
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};

// Get page commande /orders with products
exports.getOrders = (req, res, next) => {
  req.sessionUser
    //  to see products. Indication for sequelize and views. order don't have key orderItem
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Commande",
        path: "/orders",
        // all commandes fetch
        orders: orders,
        // user need to beauth to access
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};

// To generate invoice to order
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findByPk(orderId, { include: ["products"] })
    .then((order) => {
      if (!order) {
        return next(new Error("Pas de commande trouvée!"));
      }
      if (order.userId.toString() !== req.sessionUser.id.toString()) {
        return next(
          new Error(`Vous n'êtes pas autorisé à accèder à cette page!`)
        );
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("invoices", invoiceName);

      const { products } = order;

      let totalPrice = 0;

      const pdfDoc = new PDFDocument();
      res.set({
        "Content-Type": "application/pdf",
        "Content-disposition": 'inline; filename="' + invoiceName + '"',
      });
      // redirect this in a stream of file readable => readable stream, can call package file syst on this fonction
      // & store on folder invoices
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Facture", {
        underline: true,
      });
      products.forEach((prod) => {
        totalPrice += prod.orderitem.quantity * prod.price;
        pdfDoc.fontSize(14).text(` ${prod.title} : ${prod.orderitem.quantity} *
        ${prod.price} € `);
        console.log(prod.title);
      });

      pdfDoc.text(`Prix total = ${totalPrice}€`);

      pdfDoc.end();
    })
    .catch((err) => next(err));
};
