// import models to use
const Product = require("../models/product");
const User = require("../models/user");

// Get all products  /products page article
exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Articles",
        path: "/products",
        // user need to beauth to access
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// Get détails product  /products/:productId
exports.getProduct = (req, res) => {
  // productId extract from hidden input in view product ejs
  const prodId = req.params.productId;
  // Product.findByPk({ where: { id: prodId } })
  //   // return an array with a lot of element. Interesting by first element
  //   .then((product) => {
  //     console.log(product);
  //     res.render("shop/product-detail", {
  //       product: products[0],
  //       pageTitle: `Détails de l'article ${product[0].title}`,
  //       path: "/products",
  //     });
  //   });
  Product.findByPk(prodId)
    .then((product) =>
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        // user need to beauth to access
        isAuthenticated: req.session.isLoggedIn,
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
        // user need to be auth to access
        isAuthenticated: req.session.isLoggedIn,
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
            // user need to beauth to access
            isAuthenticated: req.session.isLoggedIn,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

// Add a new product in cart / or /products
// exports.postCart = (req, res) => {
//   // fetch id product to add
//   const prodId = req.body.productId;
//   let fetchedCart;
//   let newQuantity = 1;
//   const user = req.user;
//   // get cart of user
//   User.findByPk(user)
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       console.log(cart);
//       // is the product already exist in cart to increase quantity or add product if not
//       // fetch product to add
//       return cart.getProducts({ where: { id: prodId } });
//     })

//     .then((products) => {
//       // verify if product exist and store in var (array need just first element of array )
//       let product;
//       if (products.length > 0) {
//         product = products[0];
//       }
//       // if have product increase quantity
//       if (product) {
//         // fetch old quantity with accessing to between table
//         const oldQuantity = product.cartItem.quantity;
//         newQuantity = oldQuantity + 1;
//         return product;
//       }
//       // if product doesn't exist in cart, search data product to add
//       return Product.findByPk(prodId);
//     })
//     .then((product) => {
//       // through to tell sequelize we need key to between table cartItem
//       return fetchedCart.addProduct(product, {
//         through: { quantity: newQuantity },
//       });
//     })
//     .then(() => {
//       res.redirect("/cart");
//     })
//     .catch((err) => console.log(err));
// };

// exports.postCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findByPk(prodId)
//     .then((product) => {
//       return req.user.addToCart(product);
//     })
//     .then((result) => {
//       console.log(result);
//       res.redirect("/cart");
//     });
// };

// Delete product from cart /cart btn supprimer
exports.postCartDeleteProduct = (req, res) => {
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
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

// Create new command /create-order with btn commander
exports.postOrder = (req, res) => {
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
      return req.sessionUser
        .createOrder()
        .then((order) => {
          // don't use through beacause different quantity for product. Use map to associate one product with respective field
          return order.addProducts(
            products.map((product) => {
              // transformation arry product fetch with map, to get product in order in between table to get attribute of product
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      // erase cart's product with set on null
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

// Get page commande /orders with products
exports.getOrders = (req, res) => {
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
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
