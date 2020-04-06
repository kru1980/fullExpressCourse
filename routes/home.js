const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { isHome: true, title: "Главная страница" });
});

module.exports = router;
