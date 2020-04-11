const { Schema, model } = require("mongoose");

// У каждого пользователя своя корзина, те в данной модели будем хранить корзину каждого юзера
// courseId обязательный параметр (ид курса который купил юзер) тип type он понимает, что тип данного поля является типом характерным автоматическому ид-ку создаваемого монгой ref:"Course" - это ссылка на модель из которой будет браться ид

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: String,
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          require: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          require: true,
        },
      },
    ],
  },
});

// для обработки запросу card расширим данную модель, к методам данной модели добавим свой метод, добовление в корзину товара addToCard тк нужно обращение к самой ф-ции использовать стрелочную ф-цию нельзя!!
// 2 если в корзине уже есть такой курс то необходимо счетчик count увеличить
userSchema.methods.addToCart = function (course) {
  // по п2 обращаемся к корзине и проверяем поле card
  const cloneItems = [...this.cart.items]; // клонируем массив
  // в данном клоне находим индекс курса с которым работаем
  const idx = cloneItems.findIndex((c) => {
    // чтобы сравнивать со строковым параметром course.id приводим courseId из нашей схемы к строке тк у нее задан тип type:Schema.Types.ObjectId
    return c.courseId.toString() === course._id.toString();
  });
  if (idx >= 0) {
    cloneItems[idx].count = cloneItems[idx].count + 1;
  } else {
    cloneItems.push({
      courseId: course._id,
      count: 1,
    });
  }
  // 1 вариант
  //   const newCart = { items: cloneItems };
  //   this.cart = newCart;
  // 2 вариант cloneItems можно заменить на items
  this.cart = { items: cloneItems };
  return this.save();
};

userSchema.methods.removeFromCart = function (id) {
  let items = [...this.cart.items];
  const idx = items.findIndex((c) => c.courseId.toString() === id.toString());

  if (items[idx].count === 1) {
    items = items.filter((c) => c.courseId.toString() !== id.toString());
  } else {
    items[idx].count--;
  }

  this.cart = { items };
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model("User", userSchema);
