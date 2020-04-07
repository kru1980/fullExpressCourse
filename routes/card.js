const express = require("express");
const router = express.Router();
const Card = require("../models/card");
const Course = require("../models/course");

// данный роутер обрабатывет корзину покупок
// на карточке товара вместо кнопки ссылки создается форма-кнопка со скрытым полем ид курса, которое получим на данном роуте
//!! Сперва создадим новую модель отвечающую за корзину

router.get("/", async (req, res) => {
  // получаем данные для корзины
  const card = await Card.fetch();
  res.render("card", {
    title: "Корзина",
    courses: card.courses,
    price: card.price,
    isCard: true,
  });
});

router.post("/add", async (req, res) => {
  const course = await Course.getById(req.body.id);

  await Card.add(course);

  res.redirect("/card");
});


// router.delete("/remove/:id", async (req, res)=>{
//  const card =  await Card.remove(req.params.id)
//  res.status(200).json(card)
// })

router.delete('/remove/:id', async (req, res) => {
  const card = await Card.remove(req.params.id)
  res.status(200).json(card)
})

module.exports = router;
