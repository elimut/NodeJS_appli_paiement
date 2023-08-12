const fs = require("fs");
const path = require("path");
const p = path.join(__dirname, "..", "data", "products.json");
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
    this.id = Math.random().toString();
    // id unique convertit en varchar
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
    //   convert tab ou objet en json
  }
  //   méthode de sauvegarde à la la classe pour sauvegarder le produit dans le tab. This car fait réf à l'objet créé

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
