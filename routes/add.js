const express = require("express");
const router = express.Router();
const Course = require("../models/course");

router.get("/", (req, res) => {
  const { title, price, img } = req.body;
  console.log(title, price, img);
  res.render("add", { isAdd: true, title: "Добавить курс" });
});
router.post("/", (req, res) => {
  const { title, price, img } = req.body;
  const course = new Course(title, price, img);
  course.save();

  res.redirect("/courses");
});

module.exports = router;
