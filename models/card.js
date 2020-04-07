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
    const card = await Card.fetch();
    // определяем индекс курса, но его может не быть

    const idx = card.courses.findIndex((c) => c.id === course.id);
    // ищем существует ли курс или нет

    const candidate = card.courses[idx];

    if (candidate) {
      candidate.count++;
      // тк счетчик уже присутствует , то при доб второго курса, счетчик увеличивается на еденицу + обновляем данные о курсе
      card.courses[idx] = candidate;
    } else {
      // еще нет надо его добавить, добавляем ему счетчик
      // те курсу переданому в ф-цию add присваиваем count
      course.count = 1;
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

  static async remove(id) {
    const card = await Card.fetch();
    const idx = card.courses.findIndex((c) => c.id === id);
    const course = card.courses[idx];

    if (course.count === 1) {
      // remove
      card.courses = card.courses.filter((c) => c.id !== id);
    } else {
      // update
      card.courses[idx].count--;
    }
    // update price in model
    card.price -= course.price;
    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(card);
        }
      });
    });
  }
}

module.exports = Card;


