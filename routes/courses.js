const express = require("express");
const router = express.Router();
const Course = require("../models/course");

router.get("/", async (req, res) => {
  // const courses = await Course.find().lean();
  const courses = await Course.find()
    .populate("userId", "email name")
    .select("price title img")
    .lean();
 
  // !!! Тк в данных приходит только ид юзера , хотим распарсить юзера по данному ид, монго делает это с помощью метода populate, метод select("price title img") сделает выборку отмеченных полей

  res.render("courses", { isCourses: true, title: "Курсы", courses });
});

// вывод одного курса
router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);

  const { _id, title, price, img } = course;
  console.log("course", course);
  res.render("course", {
    title: `Курс ${title}`,
    id: _id,
    price,
    img,
    layout: "empty",
  });
});

// редактирование курсов
// <a href="/courses/{{id}}/edit?allow" target="_blank">Открыть курс</a>
// проверяем есть ли параметр allow те мы перешли по ссылке редактирование
// В шаблоне edit в форме добавим скрытое поле с ид курса, при отправке формы получем на сервере ид курса который надо обновить в базе
router.get("/:id/edit", async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  const course = await Course.findById(req.params.id).lean();
  console.log("course=/:id/edit", course);
  const { _id, title, price, img } = course;
  res.render("course-edit", {
    title: `Редактировать курс ${title}`,
    id: _id,
    price,
    img,
  });
});

router.post("/edit", async (req, res) => {
  const { id } = req.body;
  //удаляем у него ид, тк монгуст создает ид через нижнее подчеркивание
  delete req.body.id;

  await Course.findByIdAndUpdate(id, req.body);
  res.redirect("/courses");
});

router.post("/remove", async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id });
    res.redirect("/courses");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
