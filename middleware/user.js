const User = require('../models/user');

module.exports = async function (req, res, next){

    if(!req.session.user){
        return next()
    }

    // если юзер в сессии есть добавим в обект запроса функционал из модели юзера монги
    req.user = await User.findById(req.session.user._id)
    next()
}