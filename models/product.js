// import db to access db
const db = require("../util/database");

// Create product object
module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    // property of object
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // Insert and save data in db
  save() {
    // reach db to save data
    // create data in products, id auto generate by bdd
    // to save without SQL injection (attack with injection special data in input field like SQL query) we use ? and [] with order field
    return db.execute(
      "INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?, ?, ?)",
      [this.title, this.imageUrl, this.description, this.price]
    );
  }

  static deleteById(id) {}

  // Get all products from db
  static fetchAll() {
    // reach bdd and execute query get products in db
    return db.execute("SELECT * FROM products");
  }
  // Get by id from db
  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
