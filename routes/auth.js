const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// путь к папке где лежит шаблон, является роутом в адресной строке auth/login
router.get("/login", async (req, res) => {
  res.render("auth/login", {
    isLogin: true,
    title: "Авторизация",
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError"),
  });
});

router.post("/login", async (req, res) => {
  // тк добавили сессию, то в обхекте req запроса появиться защищенная кодовым словом сессия, она же объект для хранения той или иной информации
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      // Если юзер зареган, то проверяем хеш пароля
      const areSame = await bcrypt.compare(password, candidate.password);
      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        // В таком виде redirect наступит раньше, чем появиться юзер, поэтому
        // res.redirect("/"); заменим используем метод save() у сесии
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      } else {
        req.flash("loginError", "Не верный пароль");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "Такого пользователя не существует");
      res.redirect("/auth/login#login");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", async (req, res) => {
  //ПРи клике по кнопке меню, убиваем сессию и переменная isAuth пропадает, изменяя панель навигации и закрывая доступ не авторизованным юзерам
  // req.session.isAuthenticated = false -но есть вариант лучше

  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

// регистрация /auth/registration

router.post("/registration", async (req, res, next) => {
  try {
    const { email, password, confirm, name } = req.body;
    // проверка есть такой емайл или нет
    const candidate = await User.findOne({ email });
    if (candidate) {
      // юзер существует, отправляем ошибку на ту же страницу
      req.flash("registerError", "Пользователь существует");
      res.redirect("/auth/login#registration");
    } else {
      // при создании новоого юзера не забываем создавать юзера относительно всех тех полей, которые указаны в модели
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: { items: [] },
      });
      await user.save();
      res.redirect("/auth/login#login");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
