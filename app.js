const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const pageNotFoundController = require("./controllers/error");
// import connection bdd
const sequelize = require("./util/database");
// import models module
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-items");

// To use EJS with Express
app.set("view engine", "ejs");
// config var globale pour pug sur notre app express lui dire où trouver le moteur de template
app.set("views", "views");

// Import routes to execute
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// Analyse body res
app.use(bodyParser.urlencoded({ extended: false }));
// To tell express where are static files
app.use(express.static(path.join(__dirname, "public")));

//  middleware to reach db ans fecth user with findById. Execute for an incoming request
app.use((req, res, next) => {
  User.findByPk(1)
    // store user in a request
    .then((user) => {
      // user object JS in db and sequelize's objetc to, with methods...
      req.user = user;
      next();
    })
    // to continue if had an user
    .catch((err) => console.log(err));
});

// Middleware to fetch routes to express
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(pageNotFoundController.get404Page);

// Associations tables db:
// a product is created by user(admin) this add a fk to product
Product.belongsTo(User, {
  // facultative
  constraints: true,
  // if user deleted product too => cascade
  onDelete: "Cascade",
});
// one user can create many products
User.hasMany(Product);
// user have one cart
User.hasOne(Cart);
// one cart appartient à un user. This add a fk to cart
Cart.belongsTo(User);
// one cart have many products.  This two relations can be avaible with intermediaire table who store id product and id cart = second args (tell sequelize where store connection)
Cart.belongsToMany(Product, { through: CartItem });
// a product can be in different cart. This two relations can be avaible with intermediaire table who store id product and id cart = second args (tell sequelize where store
Product.belongsToMany(Cart, { through: CartItem });

// Verify and sync models and tables in db. If table doesn't exist sequelize create table and sequelize define association. Just config db
sequelize
  // force true to force sequelize take all new information on table already created (association and create FK after create models user)
  // .sync({ force: true })
  .sync()
  .then((_) => {
    // create manually user to test. Return a promise
    return User.findByPk(1);
    // see an object
  })
  .then((user) => {
    if (!user) {
      return User.create({ username: "Aso", email: "Aso" });
    }
    return user;
  })
  .then((user) => {
    return user.createCart({});
    // if sync db ok and user reach, server is open
  })
  .then((cart) => app.listen(8080))
  .catch((err) => console.log(err));
