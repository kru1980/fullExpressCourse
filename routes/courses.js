const express = require("express");
const router = express.Router();
const Course = require("../models/course");

router.get("/", async (req, res) => {
  const courses = await Course.getAll();
  res.render("courses", { isCourses: true, title: "Курсы", courses });
});

// вывод одного курса
router.get("/:id", async (req, res) => {
  const course = await Course.getById(req.params.id);
  res.render("course", {
    title: `${course.title}`,
    course,
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
  const course = await Course.getById(req.params.id);
  res.render("course-edit", {
    title: `Редактировать курс ${course.title}`,
    course,
  });
});

router.post("/edit", async (req, res) => {
    console.log(req.body);
    
  await Course.update(req.body);
  res.redirect("/courses");
});

module.exports = router;
