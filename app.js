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
const csrf = require("csurf");
const flash = require("connect-flash");
const keys = require("./keys");
const errorHandler = require("./middleware/error");
const fileMiddleware = require("./middleware/file");
const helmet = require('helmet')
const compression = require('compression')

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: require("./utils/hbs-helpers"),
});

const store = new MongoStore({
  uri: keys.MONGODB_URI,
  collection: "sessions",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views"); // настройка папки шаблонов

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: keys.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    store,
  })
);
// работу с загрузкой файлов подключаем после создания сессии но до пакета защиты

app.use(fileMiddleware.single("avatar"));

app.use(csrf());
app.use(helmet())
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);
app.use(compression())

// mongo

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
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
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", routesApp.homeRoute);
app.use("/add", routesApp.addCourseRoute);
app.use("/card", routesApp.addCardRoute);
app.use("/auth", routesApp.authRoute);
app.use("/orders", routesApp.ordersRoute);
app.use("/courses", routesApp.coursesRoute);
app.use("/profile", routesApp.profileRoute);

//подключать строго внизу после всех роутов
app.use(errorHandler);

start();
