const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("login", { isLogin: true, title: "Страница регистрации" });
});

module.exports = router;
