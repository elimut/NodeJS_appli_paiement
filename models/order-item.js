// Import objet Sequelize from package
const Sequelize = require("sequelize");

// Import sequelize connection db
const sequelize = require("../util/database");

// Create models orderItem with connection pool of sequelize
// first arg= name of table, second: structure of models, JS object (attributs of models)
const OrderItem = sequelize.define("orderItem", {
  // attributs are define with object too
  //   item is a combinaison of product and id cart => create association in app.js
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: Sequelize.INTEGER,
});

module.exports = OrderItem;
