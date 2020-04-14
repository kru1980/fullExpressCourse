const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");

router.get("/", auth, async (req, res) => {
  // req.user.toObject() тк после авторизации в объекте запроса будем хранить информацию об юзере, поэтому все данные юзера можем передавать на страницу профиля. Приведение данных по методу toObject() позволяет нормализовать данные строго в объект
  res.render("profile", {
    isProfile: true,
    title: "Профиль",
    user: req.user.toObject(),
  });
});

router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const toChange = {
      name: req.body.name,
    };

  

    if (req.file) {
      toChange.avatarUrl = req.file.path;
    }

    Object.assign(user, toChange);
    await user.save();
    res.redirect("/profile");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
