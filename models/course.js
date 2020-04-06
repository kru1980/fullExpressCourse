// модель по типу класса
// const uuid = require("uuid/v4");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

class Course {
  constructor(title, price, img) {
    this.title = title;
    this.price = price;
    this.img = img;
    this.id = uuidv4();
  }

  toJSON() {
    return {
      title: this.title,
      price: this.price,
      img: this.img,
      id: this.id,
    };
  }

  static async update(course) {
    const courses = await Course.getAll();
// Найдем индекс курса и обновим его
    const idx = courses.findIndex((c) => c.id == course.id);
    courses[idx] = course;
    const pathStorage = path.join(__dirname, "..", "data", "courses.json");
    return new Promise((resolve, reject) => {
      fs.writeFile(pathStorage, JSON.stringify(courses), (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  async save() {
    // Вызывая данный метод, полученные данные сохраняем в json объект и сохраняем в хранилище данных
    const courses = await Course.getAll();

    courses.push(this.toJSON());

    const pathStorage = path.join(__dirname, "..", "data", "courses.json");

    return new Promise((resolve, reject) => {
      fs.writeFile(pathStorage, JSON.stringify(courses), (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  // создадим статические методы получения всех данных
  // getAll
  static getAll() {
    const pathData = path.join(__dirname, "..", "data", "courses.json");
    return new Promise((resolve, reject) => {
      fs.readFile(pathData, "utf-8", (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(content));
        }
      });
    });
  }

  static async getById(id) {
    const courses = await Course.getAll();
    return courses.find((i) => i.id === id);
  }
}

module.exports = Course;
