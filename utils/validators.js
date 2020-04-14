const { check } = require("express-validator");
const User = require("../models/user");

// Иногда  надо добавлять свой кастомный валидатор, используем ф-цию costom

exports.registerValidators = [
  check("email")
    .isEmail()
    .withMessage("Введите корректный email")
    .custom(async (value, { req }) => {
      try {
        const candidate = await User.findOne({ email: value });
        if (candidate) {
          return Promise.reject("ТАкой email занят");
        }
      } catch (error) {
        console.log(error);
      }
    })
    .normalizeEmail(),
  check("password", "Пароль должен быть минимум 6 символов")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  check("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Пароли должны совпадать");
      }
      return true;
    })
    .trim(),
  check("name")
    .isLength({ min: 3 })
    .withMessage("Имя должно быть минимум 3 символа")
    .trim(),
];
exports.loginValidators = [
  check("email")
    .isEmail()
    .withMessage("Введите корректный email").custom(async (value, { req }) => {
        try {
          const candidate = await User.findOne({ email: value });
          if (!candidate) {
            return Promise.reject("Такой email не существует");
          }
        } catch (error) {
          console.log(error);
        }
      })
    .normalizeEmail(),
  check("password", "Пароль должен быть минимум 6 символов")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),

];


exports.courseValidators = [
  check('title').isLength({min: 3}).withMessage('Минимальная длинна названия 3 символа').trim(),
  check('price').isNumeric().withMessage('Введите корректную цену'),
  check('img', 'Введите корректный Url картинки').isURL()
]