const express = require("express");
const app = express();
const session = require("express-session");
// product constructor fonction store in db
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const csrf = require("csurf");
const flash = require("connect-flash");

const bodyParser = require("body-parser");
const path = require("path");
const pageNotFoundController = require("./controllers/error");
// import connection bdd
const sequelize = require("./util/database");
// import models module
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

// To use EJS with Express
app.set("view engine", "ejs");
// config var globale pour pug sur notre app express lui dire où trouver le moteur de template
app.set("views", "views");

// Import routes to execute
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// Initialize csrf protection. value session default. Middleware
const csrfProtection = csrf();

// Analyse body res
app.use(bodyParser.urlencoded({ extended: false }));
// To tell express where are static files
app.use(express.static(path.join(__dirname, "public")));
// execute session like a fonction, arg config session
// secret to hash value store in session
// resave reegister option false to not register session to each req only if somthing change in session
// saveUnInitialized false none session will be register for a req
// app.use(session({ secret: "donttouch", resave: false }));
app.use(
  session({
    secret: "keayboard cat",
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  const sessionUser = User.build({ ...req.session.user });
  req.sessionUser = sessionUser;
  if (!req.session.user) {
    return next();
  }
  User.findByPk(sessionUser.id)
    // store user in a request
    .then((user) => {
      req.user = user;
      // console.log(user);
      next();
    })
    // to continue if had an user
    .catch((err) => console.log(err));
});

// Middlewares:
// middleware protection csrf
app.use(csrfProtection);
// middleware to generate error message
app.use(flash());

// Tp past this fields in rendered views
app.use((req, res, next) => {
  // define local variable, to all req this fields'll be define to the views who render
  // user need to be auth to access
  (res.locals.isAuthenticated = req.session.isLoggedIn),
    // method provided by middleware to generate csrf token store in crsfToken, after we can use on views
    (res.locals.csrfToken = req.csrfToken());
  next();
});

// middleware to fetch routes to express
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
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
// order belongs to one user
Order.belongsTo(User);
// one user can have many orders: one to many relationship
User.hasMany(Order);
// one command can belong many products
Order.belongsToMany(Product, { through: OrderItem });

// Verify and sync models and tables in db. If table doesn't exist sequelize create table and sequelize define association. Just config db
sequelize
  // force true to force sequelize take all new information on table already created (association and create FK after create models user)
  // .sync({ force: true })
  .sync()
  // .then((_) => {
  //   // create manually user to test. Return a promise
  //   return User.findByPk(1);
  //   // see an object
  // })
  // .then((user) => {
  //   if (!user) {
  //     return User.create({ username: "aso", email: "aso@gmail.com" });
  //   }
  //   return user;
  // })
  // .then((user) => {
  //   return user.createCart({});
  //   // if sync db ok and user reach, server is open
  // })
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err));
