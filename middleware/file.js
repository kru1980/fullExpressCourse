const multer = require("multer");

//создать хранилище загруженных файлов из пакета multer
const storage = multer.diskStorage({
    destination(req, file, cb){
        // куда складывать загруженный файл первый параметр в функции это ошибка, тк у нас ошибок нет то null
        cb(null, "images")
    },
    filename(req, file, cb){
// данная функция после загрузке пересоздаст имя загруженного файла. Главное создать такие имена, которые не будут повторяться
cb(null, new Date().toDateString() + " - " + file.originalname)

    }
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => {
// Вадидатор загружаемых файлов, например ограничить расширения у загружаемых файлов

if(allowedTypes.includes(file.mimetype)){
    cb(null, true)
}else {
    cb(null, false)
}

};

module.exports = multer({
  storage,
  fileFilter,
});
