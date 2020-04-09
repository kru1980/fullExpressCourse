const express = require("express");
const exphbs = require("express-handlebars");
const routesApp = require("./routes");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs"


});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views"); // настройка папки шаблонов

//временное решение
app.use(async (req, res, next) => {
  try {
    // у объекта запроса всегда будет моковое значение юзера
    const user = await User.findById("5e8df617c8af1e0388cd017a");
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// mongo

async function start() {
  const url = "mongodb+srv://kru1980:022749@cluster0-ezfph.mongodb.net/shop";

  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    // Дурная идея! Если юзера нет то мы его создадим метод findOne() вернет юзера из базы если он есть
    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: "Dane90@gmail.com",
        name: "Etha",
        cart: { items: [] },
      });
      await user.save();
    }
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
app.use("/login", routesApp.loginRoute);
app.use("/orders", routesApp.ordersRoute);
app.use("/courses", routesApp.coursesRoute);

start();
