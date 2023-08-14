const fs = require("fs");
const path = require("path");
const p = path.join(__dirname, "..", "data", "products.json");

const Cart = require("./cart");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    //   rappel d'un tab vide
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
      //   renvoi tab sous forme analysée
    }
  });
  //   recup des objets satic permet de recup les objets sur la classe elle même et non sur l'objet instancié
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    // prop de la classe construire objet de cette classe
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        // verify of product existing, searching index of existing product
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        // create update array with search, extracte property all existing products in new array
        const updatedProducts = [...products];
        // replace index with information of existing product found and new create
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        // id unique convertit en varchar
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }
  //   méthode de sauvegarde à la la classe pour sauvegarder le produit dans le tab. This car fait réf à l'objet créé

  static deleteById(id) {
    // delete product by id and delete in the cart
    getProductsFromFile((products) => {
      // search in product products'id to delete, we can extracte product.price to update cart
      const product = products.find((prod) => prod.id === id);
      // console.log(products);
      // keep only product no deleted
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          // call delete product in the cart's model with product's id to delete
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      // fct synch n'exécute aucun code
      cb(product);
    });
    // filtrage des produits avec l'id
  }
};
