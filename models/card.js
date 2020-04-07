const path = require("path");
const fs = require("fs");
// const card = require("../data/card.json");

// 2ой способ создания абсолютгого пути
//mainModule изучить
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "card.json"
);

class Card {
  static async add(course) {
    // получаем из модели все  данные корзины
    const card = Card.fetch();
    // определяем индекс курса, но его может не быть
    try {
      const idx = card.courses.findIndex((c) => c.id === course.id);
      // ищем существует ли курс или нет

      const candidate = card.courses[idx];
    } catch (error) {}
    if (candidate) {
      candidate.count++;
      // тк счетчик уже присутствует , то при доб второго курса, счетчик увеличивается на еденицу + обновляем данные о курсе
      card.courses[idx] = candidate;
    } else {
      // еще нет надо его добавить, добавляем ему счетчик
      courses.count = 1;
      card.courses.push(course);
    }
    // 3 шаг укажем у карточки общ стоимость курсов , знак +, на всякий случай чтобы цена приняла формат цифры
    card.price += +course.price;
    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), (err, card) => {
        if (err) {
          reject(err);
        } else {
          resolve(); // пустой резолв сигнализирует что промис выполнился
        }
      });
    });
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, "utf-8", (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(content));
        }
      });
    });
  }
}

module.exports = Card;
