const express = require("express");
const exphbs = require("express-handlebars");
const routesApp = require("./routes");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const path = require("path");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const csrf = require('csurf')
const flash = require('connect-flash');

const app = express();

const MONGODB_URI =
  "mongodb+srv://kru1980:022749@cluster0-ezfph.mongodb.net/shop";

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

const store = new MongoStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views"); // настройка папки шаблонов

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

// mongo

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}!`);
    });
  } catch (error) {
    console.log(error);
  }
}
// midllewares
// ! не корректно назначать таким образом статическую папку public
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", routesApp.homeRoute);
app.use("/add", routesApp.addCourseRoute);
app.use("/card", routesApp.addCardRoute);
app.use("/auth", routesApp.authRoute);
app.use("/orders", routesApp.ordersRoute);
app.use("/courses", routesApp.coursesRoute);

start();
