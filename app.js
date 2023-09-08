// Express server, routes, ...
// Import Express to config route, middleware & create server
const express = require("express");
// Create instance of express to use
const app = express();

// Session:
// Import middleware session to use session cookie
const session = require("express-session");
// product constructor fonction store in db, to store session cookie
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Import CSRF
const csrf = require("csurf");

// Import flash to generate error message
const flash = require("connect-flash");

// Import body-parser to analyse req body
const bodyParser = require("body-parser");

// Import multer to charge images
const multer = require("multer");

const path = require("path");

// Import controller of error
const errorController = require("./controllers/error");

// Import connection bdd
const sequelize = require("./util/database");

// Import models module
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

// Initialize csrf protection
const csrfProtection = csrf();

// Params of multer to charge images => store & name
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + " - " + file.originalname);
  },
});
//
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// To use EJS with Express:
// attribute ejs to view engine
app.set("view engine", "ejs");
// to tell express where are views
app.set("views", "views");

// Import routes to execute with express
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// To use methodd put & delete on HTML form
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Analyse body req from form post
app.use(bodyParser.urlencoded({ extended: false }));

// Params multer to store images
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// To tell express where are static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// Use session:
// secret to hash value store in session, sign cookie
// resave reegister option false to not register session to each req only if somthing change in session
// saveUnInitialized false none session will be register for a req
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

// Middlewares:
// middleware protection csrf, to genrate & verify token csrf
app.use(csrfProtection);
// middleware to generate error message
app.use(flash());
// to build a sessionUser
app.use((req, res, next) => {
  // create instance of User with req.session.user
  const sessionUser = User.build({ ...req.session.user });
  req.sessionUser = sessionUser;
  if (!req.session.user) {
    return next();
  }
  User.findByPk(sessionUser.id)
    // store user in a request
    .then((user) => {
      if (!user) {
        // to don't store undefined object user and continue
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

// To past  fields in rendered views
app.use((req, res, next) => {
  // define local variable, to all req this fields'll be define to the views who render
  // user need to be auth to access
  (res.locals.isAuthenticated = req.session.isLoggedIn),
    // method provided by middleware to generate csrf token store in crsfToken, after we can use on views
    (res.locals.csrfToken = req.csrfToken());
  next();
});

// Middlewares to fetch routes to express:
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// Middlewraes to generate error:
app.use(errorController.get404Page);
app.use("/500", errorController.get500Page);
// Error handling middleware, when we call return next(error) in controllers
// no 404 because it's an techniquly error
app.use((error, req, res) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

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
  // .sync({ force: true })
  .sync()
  // Listening on port 8080 req http
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err));
