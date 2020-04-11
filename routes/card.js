const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const auth = require("../middleware/auth");

// helper
function mapCartItems(cart) {
  return cart.items.map((c) => ({
    ...c.courseId._doc,
    id: c.courseId.is,
    count: c.count,
  }));
}

function computePrice(courses) {
  return courses.reduce((total, course) => {
    return (total += course.price * course.count);
  }, 0);
}

// данный роутер обрабатывет корзину покупок
// на карточке товара вместо кнопки ссылки создается форма-кнопка со скрытым полем ид курса, которое получим на данном роуте
//!! Сперва создадим новую модель отвечающую за корзину

router.get("/", auth, async (req, res) => {
  //получаем данные для корзины
  const user = await req.user.populate('cart.items.courseId').execPopulate()
  const courses = mapCartItems(user.cart);

  res.render("card", {
    title: "Корзина",
    courses,
    price: computePrice(courses),
    isCard: true,
  });
});

router.post("/add", auth, async (req, res) => {
  //работаем с каждым пользователем отдельно, поэтому сперва расширяем функционал модели юзера, доб метод addToCard в который передаем курс те в объекте запроса присвоеный вновь созданный юзер получит данный метод

  try {
    const course = await Course.findById(req.body.id);
    //После доб сесиий, данные о юзере храним в сесии и значит метода addToCart там нет. Написать req.sesion.user.addToCart( ) тк метод addToCart принадлежит модели юзера, а в сессии его нет
    // Решить данную проблему будем с помощью мидлвары

    await req.user.addToCart(course);
    res.redirect("/card");
  } catch (error) {
    console.log(error);
  }
});

router.delete("/remove/:id", auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate("cart.items.courseId").execPopulate();
  const courses = mapCartItems(user.cart);
  const cart = {
    courses,
    price: computePrice(courses),
  };
  res.status(200).json(cart);
});

module.exports = router;
