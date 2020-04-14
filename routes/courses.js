const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const auth = require("../middleware/auth");
const { validationResult } = require("express-validator");
const { courseValidators } = require("../utils/validators");

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString();
}

router.get("/", async (req, res) => {
  try {
    // const courses = await Course.find().lean();
    const courses = await Course.find()
      .populate("userId", "email name")
      .select("price title img")
      .lean();

    // !!! Тк в данных приходит только ид юзера , хотим распарсить юзера по данному ид, монго делает это с помощью метода populate, метод select("price title img") сделает выборку отмеченных полей
    // Задача убрать кнопку редактировать курс у пользователя не являющего автором курса. Для рендеринга страницы курсов будем передавать ид юзера из объекта ответа сервера req.user, если юзер не авторизован передадим null
    res.render("courses", {
      isCourses: true,
      title: "Курсы",
      courses,
      userId: req.user ? req.user._id.toString() : null,
    });
  } catch (error) {
    console.log(error);
  }
});

// вывод одного курса
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const { _id, title, price, img } = course;
    res.render("course", {
      title: `Курс ${title}`,
      id: _id,
      price,
      img,
      layout: "empty",
    });
  } catch (error) {
    console.log(error);
  }
});

// редактирование курсов
// <a href="/courses/{{id}}/edit?allow" target="_blank">Открыть курс</a>
// проверяем есть ли параметр allow те мы перешли по ссылке редактирование
// В шаблоне edit в форме добавим скрытое поле с ид курса, при отправке формы получем на сервере ид курса который надо обновить в базе
router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  try {
    const course = await Course.findById(req.params.id).lean();
    const { _id, title, price, img } = course;

    //!ЗАпретим юзерам с разными ид редактирование курсов
    if (!isOwner(course, req)) {
      return res.redirect("/coutses");
    }
    res.render("course-edit", {
      title,
      id: _id,
      price,
      img,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit", auth, courseValidators, async (req, res) => {
  const { id } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
  }
  try {
    //удаляем у него ид, тк монгуст создает ид через нижнее подчеркивание
    delete req.body.id;
    const course = await Course.findById(id);
    if (!isOwner(course, req)) {
      return res.redirect("/courses");
    }
    // обновим курс
    Object.assign(course, req.body);

    await course.save();

    res.redirect("/courses");
  } catch (error) {
    console.log(error);
  }
});

router.post("/remove", auth, async (req, res) => {
  try {
    // userId:req.user._id - данный параметр появился для защиты удаления курса не автором курса. МОнга не удалит курс, если два параметра не совпадут
    await Course.deleteOne({ _id: req.body.id, userId: req.user._id });
    res.redirect("/courses");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
