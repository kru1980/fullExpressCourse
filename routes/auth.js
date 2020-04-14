const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const { registerValidators, loginValidators } = require("../utils/validators");

// путь к папке где лежит шаблон, является роутом в адресной строке auth/login
router.get("/login", async (req, res) => {
  res.render("auth/login", {
    isLogin: true,
    title: "Авторизация",
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError"),
  });
});

router.post("/login", loginValidators, async (req, res) => {
  // тк добавили сессию, то в обхекте req запроса появиться защищенная кодовым словом сессия, она же объект для хранения той или иной информации

  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("loginError", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#login");
    }
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

router.post("/register", registerValidators, async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    // проверка есть такой емайл или нет
    // const candidate = await User.findOne({ email }); // переехала проверка в utils
    // валидация
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("registerError", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#register");
    }

    // if (candidate) {
    // юзер существует, отправляем ошибку на ту же страницу
    // При использования пакета валидации, не плохо былобы чтобы данный пакет проверял наличие юзера в базе. НО данная опреация требут асинхронного запроса к базе, поэтому для поля емайл добавим кастомный валидатор, и текущую проверку с отправкой флеш сообщения переделаем
    // req.flash("registerError", "Пользователь существует");
    // res.redirect("/auth/login#register");
    // } else {
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
    // }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
