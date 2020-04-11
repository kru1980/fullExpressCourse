const { Router } = require("express");
const Course = require("../models/course");
const router = Router();
const auth =require('../middleware/auth');

router.get("/", auth,(req, res) => {
  res.render("add", {
    title: "Добавить курс",
    isAdd: true,
  });
});

// Данный курс свяжем с юзером который его создает
// userId:req.user._id - так надо указать, но можно сократить запись тк в модели мы в типе указали object... итого userId:req.user (автоматически возьмется нужный ид)
router.post("/", auth, async (req, res) => {
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user,
  });

  try {
    await course.save();
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
