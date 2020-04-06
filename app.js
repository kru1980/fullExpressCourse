const express = require("express");
const exphbs = require("express-handlebars");
const routesApp = require("./routes");
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000;


const app = express();
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views"); // настройка папки шаблонов

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// midllewares
app.use(express.static("public"));
app.use("/", routesApp.homeRoute);
app.use("/add", routesApp.addCourseRoute);
app.use("/login", routesApp.loginRoute);
app.use("/courses", routesApp.coursesRoute);



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});