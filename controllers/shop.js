// const fs = require("fs");
// const path = require("path");
// const stripe = require("stripe")(
//   "sk_test_51NkNbrHlGcwFv9WTYWlAPm9ZLNzaF8VmQSYRYNoBTLgKzWqK8iNsmxNcGLBMHAWHj7UU8RwfWiuVK7LMikuaM18m00grqI3B15"
// );
// const PDFDocument = require("pdfkit");
// const Product = require("../models/product");
// const User = require("../models/user");
// const Order = require("../models/order");
// const ITEMS_PER_PAGE = 2;

// // Utilisez une fonction de gestion d'erreur commune
// function handleInternalServerError(err, next) {
//   console.error(err);
//   const error = new Error("Une erreur s'est produite.");
//   error.httpStatusCode = 500;
//   return next(error);
// }

// exports.getProducts = (req, res, next) => {
//   const page = +req.query.page || 1;
//   const offset = (page - 1) * ITEMS_PER_PAGE;
//   let totalItems;

//   Product.findAndCountAll()
//     .then((numProducts) => {
//       totalItems = numProducts.count;
//       return Product.findAll({
//         offset: offset,
//         limit: ITEMS_PER_PAGE,
//       });
//     })
//     .then((products) => {
//       res.render("shop/product-list", {
//         prods: products,
//         pageTitle: "Articles",
//         path: "/products",
//         currentPage: page,
//         hasNextPage: ITEMS_PER_PAGE * page < totalItems,
//         hasPreviousPage: page > 1,
//         nextPage: page + 1,
//         previousPage: page - 1,
//         lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
//       });
//     })
//     .catch((err) => handleInternalServerError(err, next));
// };

// exports.getProduct = (req, res, next) => {
//   const prodId = req.params.productId;
//   Product.findByPk(prodId)
//     .then((product) =>
//       res.render("shop/product-detail", {
//         product: product,
//         pageTitle: product.title,
//         path: "/products",
//       })
//     )
//     .catch((err) => handleInternalServerError(err, next));
// };

// exports.getIndex = (req, res, next) => {
//   const page = +req.query.page || 1;
//   const offset = (page - 1) * ITEMS_PER_PAGE;
//   let totalItems;

//   Product.findAndCountAll()
//     .then((numProducts) => {
//       totalItems = numProducts.count;
//       return Product.findAll({
//         offset: offset,
//         limit: ITEMS_PER_PAGE,
//       });
//     })
//     .then((products) => {
//       res.render("shop/index", {
//         prods: products,
//         pageTitle: "Boutique",
//         path: "/",
//         currentPage: page,
//         hasNextPage: ITEMS_PER_PAGE * page < totalItems,
//         hasPreviousPage: page > 1,
//         nextPage: page + 1,
//         previousPage: page - 1,
//         lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
//       });
//     })
//     .catch((err) => handleInternalServerError(err, next));
// };

// // Le reste de votre code continue de manière similaire en utilisant la gestion des erreurs de la même manière.

// exports.getCart = (req, res, next) => {
//   req.sessionUser
//     .getCart()
//     .then((cart) => {
//       let user = req.sessionUser;
//       if (!cart) {
//         return user.createCart();
//       }
//       return cart.getProducts().then((products) => {
//         res.render("shop/cart", {
//           pageTitle: "Panier",
//           path: "/cart",
//           products: products,
//         });
//       });
//     })
//     .catch((err) => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };
// exports.postCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   let fetchedCart;
//   let newQuantity = 1;
//   const user = req.sessionUser.id;
//   User.findByPk(user)
//     .then((userId) => {
//       return userId.getCart();
//     })
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts({ where: { id: prodId } });
//     })
//     .then((products) => {
//       let product;
//       if (products.length > 0) {
//         product = products[0];
//       }
//       if (product) {
//         const oldQuantity = product.cartitem.quantity;
//         newQuantity = oldQuantity + 1;
//       }
//       return Product.findByPk(prodId);
//     })
//     .then((product) => {
//       return fetchedCart.addProduct(product, {
//         through: { quantity: newQuantity },
//       });
//     })
//     .then(() => {
//       res.redirect("/cart");
//     })
//     .catch((err) => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.sessionUser
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts({ where: { id: prodId } });
//     })
//     .then((products) => {
//       const product = products[0];
//       return product.cartitem.destroy();
//     })
//     .then((result) => {
//       res.redirect("/cart");
//     })
//     .catch((err) => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };
// exports.getCheckout = (req, res, next) => {
//   let fetchedCart;
//   let total = 0;

//   req.sessionUser
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts(); // Récupérer les produits du panier
//     })
//     .then((products) => {
//       total = products.reduce((sum, product) => {
//         return sum + product.cartitem.quantity * product.price;
//       }, 0);

//       const line_items = products.map((product) => ({
//         price_data: {
//           currency: "eur",
//           product_data: {
//             name: product.title,
//           },
//           unit_amount: product.price * 100, // Convertir en centimes
//         },
//         quantity: product.cartitem.quantity,
//       }));

//       return stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items,
//         mode: "payment",
//         success_url:
//           req.protocol + "://" + req.get("host") + "/checkout/success",
//         cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
//       });
//     })
//     .then((session) => {
//       console.log("session: ", session);
//       res.render("shop/checkout", {
//         pageTitle: "Paiement",
//         path: "/checkout",
//         totalSum: total,
//         sessionId: session.id,
//       });
//     })
//     .catch((err) => {
//       console.error("Erreur lors de la création de la session Stripe:", err);
//       return next(err); // Gérez l'erreur de manière appropriée
//     });
// };

// exports.postOrder = (req, res, next) => {
//   // store cart
//   let fetchedCart;
//   req.sessionUser
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) => {
//       return req.sessionUser.createOrder().then((order) => {
//         return order.addProducts(
//           products.map((product) => {
//             product.orderitem = { quantity: product.cartitem.quantity };
//             return product;
//           })
//         );
//       });
//     })
//     .then((result) => {
//       return fetchedCart.setProducts(null);
//     })
//     .then((result) => {
//       res.redirect("/orders");
//     })
//     .catch((err) => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.getCheckoutSuccess = (req, res, next) => {
//   let fetchedCart;
//   req.sessionUser
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) => {
//       return req.sessionUser.createOrder().then((order) => {
//         return order.addProducts(
//           products.map((product) => {
//             product.orderitem = { quantity: product.cartitem.quantity };
//             return product;
//           })
//         );
//       });
//     })
//     .then((result) => {
//       return fetchedCart.setProducts(null);
//     })
//     .then((result) => {
//       res.redirect("/orders");
//     })
//     .catch((err) => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };
// exports.getOrders = (req, res, next) => {
//   req.sessionUser
//     .getOrders({ include: ["products"] })
//     .then((orders) => {
//       res.render("shop/orders", {
//         pageTitle: "Commande",
//         path: "/orders",
//         orders: orders,
//       });
//     })
//     .catch((err) => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };
// exports.getInvoice = (req, res, next) => {
//   const orderId = req.params.orderId;
//   Order.findByPk(orderId, { include: ["products"] })
//     .then((order) => {
//       if (!order) {
//         return next(new Error("Pas de commande trouvée!"));
//       }
//       if (order.userId.toString() !== req.sessionUser.id.toString()) {
//         return next(
//           new Error(`Vous n'êtes pas autorisé à accèder à cette page!`)
//         );
//       }
//       const invoiceName = "invoice-" + orderId + ".pdf";
//       const invoicePath = path.join("invoices", invoiceName);

//       const { products } = order;

//       let totalPrice = 0;

//       const pdfDoc = new PDFDocument();
//       res.set({
//         "Content-Type": "application/pdf",
//         "Content-disposition": 'inline; filename="' + invoiceName + '"',
//       });
//       pdfDoc.pipe(fs.createWriteStream(invoicePath));
//       pdfDoc.pipe(res);

//       pdfDoc.fontSize(26).text("Facture", {
//         underline: true,
//       });
//       products.forEach((prod) => {
//         totalPrice += prod.orderitem.quantity * prod.price;
//         pdfDoc.fontSize(14).text(` ${prod.title} : ${prod.orderitem.quantity} *
//         ${prod.price} € `);
//         // console.log(prod.title);
//       });

//       pdfDoc.text(`Prix total = ${totalPrice}€`);

//       pdfDoc.end();
//     })
//     .catch((err) => next(err));
// };

// ------------------------------------------sauvegarde----------------------------------------------

const fs = require("fs");
const path = require("path");
// Import Stripe, give a function to execute, dans laquelle l'on passe une clé privée (secret key on Stripe)
const stripe = require("stripe")(
  "sk_test_51NkNbrHlGcwFv9WTYWlAPm9ZLNzaF8VmQSYRYNoBTLgKzWqK8iNsmxNcGLBMHAWHj7UU8RwfWiuVK7LMikuaM18m00grqI3B15"
);

const PDFDocument = require("pdfkit");

// Import models to use
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const { log } = require("console");

const ITEMS_PER_PAGE = 2;

// Get all products  /products page article
exports.getProducts = (req, res, next) => {
  // /?page= query's name: page. If not defined => 1
  const page = +req.query.page || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;
  let totalItems;

  Product.findAndCountAll()
    .then((numProducts) => {
      totalItems = numProducts.count;
      return Product.findAll({
        offset: offset,
        limit: ITEMS_PER_PAGE,
      });
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Articles",
        path: "/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
  // /?page= query's name: page. If not defined => 1
  const page = +req.query.page || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;
  let totalItems;

  Product.findAndCountAll()
    .then((numProducts) => {
      totalItems = numProducts.count;
      return Product.findAll({
        offset: offset,
        limit: ITEMS_PER_PAGE,
      });
    })
    // reach array of products
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Boutique",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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

// Access to checkout page /checkout
exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  req.sessionUser
    .getCart()
    .then((cart) => {
      // let user = req.sessionUser;
      // if (!cart) {
      //   return user.createCart();
      // }
      // console.log(cart);
      return cart
        .getProducts()
        .then((product) => {
          total = 0;
          product.forEach((p) => {
            total += p.cartitem.quantity * p.price;
          });
          products = product;
          // creating session key to use stripe in front. Configure session
          const line_items = products.map((p) => ({
            price_data: {
              currency: "eur",
              product_data: {
                name: p.title,
              },
              unit_amount: p.price * 100, // Convertir en centimes
            },
            quantity: p.cartitem.quantity,
          }));
          return stripe.checkout.sessions.create({
            line_items,
            payment_method_types: ["card"],
            mode: "payment",
            success_url:
              req.protocol + "://" + req.get("host") + "/checkout/success",
            cancel_url:
              req.protocol + "://" + req.get("host") + "/checkout/cancel",
          });
        })
        .then((session) => {
          res.render("shop/checkout", {
            pageTitle: "Paiement",
            path: "/checkout",
            products: products,
            totalSum: total,
            sessionId: session.id,
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          console.error(error);
          // express'll go in error handling middleware
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.error(error);
      // express'll go in error handling middleware
      return next(error);
    });
};

// exports.getCheckout = (req, res, next) => {
//   var total = 0;
//   var products;

//   req.sessionUser
//     .getCart()
//     .then((cart) => {
//       products = cart;
//       return cart.getProducts(); // Récupérer les produits du panier
//     })
//     .then((products) => {
//       total = products.reduce((sum, product) => {
//         return sum + product.cartitem.quantity * product.price;
//       }, 0);

//       const line_items = products.map((product) => ({
//         price_data: {
//           currency: "eur",
//           product_data: {
//             name: product.title,
//           },
//           unit_amount: product.price * 100, // Convertir en centimes
//         },
//         quantity: product.cartitem.quantity,
//       }));

//       return stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items,
//         mode: "payment",
//         success_url:
//           req.protocol + "://" + req.get("host") + "/checkout/success",
//         cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
//       });
//     })
//     .then((session) => {
//       res.render("shop/checkout", {
//         pageTitle: "Paiement",
//         path: "/checkout",
//         products: products,
//         totalSum: total,
//         sessionId: session.id,
//       });
//     })
//     .catch((err) => {
//       console.error("Erreur lors de la création de la session Stripe:", err);
//       return next(err); // Gérez l'erreur de manière appropriée
//     });
// };

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

exports.getCheckoutSuccess = (req, res, next) => {
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
        // console.log(prod.title);
      });

      pdfDoc.text(`Prix total = ${totalPrice}€`);

      pdfDoc.end();
    })
    .catch((err) => next(err));
};
