const { Schema, model } = require("mongoose");

const courseShema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// ref: "User" - данная строк строго совпадает с тем как указано в модели
// module.exports = model("User", user);

courseShema.method("toClient", function () {
  const course = this.toObject();
  course.id = course._id;
  delete course._id;

  return course;
});

module.exports = model("Course", courseShema);
