const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "..", "data", "cart.json");

module.exports = class Cart {
  // Create a new cart to manage product not create new product => method addProduct use id of product added in the cart.
  static addProduct(id, productPrice) {
    // Fetch the previous cart:
    fs.readFile(p, (err, fileContent) => {
      // If error: no cart => create a new cart:
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product:
      // find product's position in the array to update cart with new quantity
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      // Add new product or increase quantity
      // if product doesn't exist in the cart, add new product with quantity:
      let updatedProduct;
      // if product exists in the cart, increasing
      if (existingProduct) {
        // use spread operatot to get all properties of the object find
        updatedProduct = { ...existingProduct };
        // increase product quantity
        updatedProduct.qty = updatedProduct.qty + 1;
        // update cart's list with old product increase
        cart.products = [...cart.products];
        // replace element increase in the product's list
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // Create in the cart
        updatedProduct = { id: id, qty: 1 };
        // update cart's list product whit new and old product
        cart.products = [...cart.products, updatedProduct];
      }
      // update cart's price
      //   console.log(typeof productPrice);
      //   console.log(typeof cart.totalPrice);
      productPrice = parseFloat(productPrice);
      //   cart.totalPrice = parseInt(cart.totalPrice);
      cart.totalPrice += productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        // no cart to delete
        return;
      }
      // old cart property in the new object
      const updatedCart = { ...JSON.parse(fileContent) };
      // search product's quantity with id of product to delete
      const product = updatedCart.products.find((prod) => prod.id === id);
      // verify if we have product and if not, don't continue instrcution because if we don't have product in cart and we want to delete a product (admin) =>  qty is an error
      if (!product) {
        return;
      }
      // store quantity in const
      const productQty = product.qty;
      // update products in the cart, we keep only products we don't need to be delete
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      // update cart's total price
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;
      // update BDD
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
