// import & store packages to use them to reach connection db
const Sequelize = require("sequelize");
// create an instance of sequelize to connect bdd (connection pool:pool is better for multi queries. one req one connection. when req is finished, connection is retransmitted  in the pool et she's new available for a new query.)
const sequelize = new Sequelize("boutique", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
