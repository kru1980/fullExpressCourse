Course fullExpress

1 Для организации кнопки удаления курса создаем клиентский js файл который через аякс асинхронно будет удалять курсы из корзины. В шаблоне добавим класс по которому найдем кнопку. Важно в данной конпки доб атрибут data с ид курса который будем удалять
2 Тема из видео 11 не заработала, поэтому вместо метода заменяющего \_id на id поменял шаблон используя \_id
3 На стр curses.hbs формируется карточка товара в ней не авторизованному полбхователю надо скрыть кнопуи, используем переменную isAuth из сессий, но тк формирование карточки идет в цикле перебора массива curses, доступ к переменной isAuth закрыт, тк она в корне страницы, используем следующую запись {{#if @root.isAuth}} html code {{/if}}
4 Видео 10 раздела 5, Безопасность проекта. Могут своровать сессию, поэтому будем генерировать ключи уникальные для данного клиента пакет npm i csurf. Для его использования рефактори все формы в приложениях. Доб ее в app.use(csurf()) строго после мидлвары по созданию сессии. Все пост запросы в формах надо переделать. Те добавим скрытое поле которое добавит уникальный ключ, который мы сперва передадим на клиента. Делаем это через мидлвару в которой создаем сессию - variables (res.locals.csrf = req.csrfToken();)
Не забываем про добавление данной переменной в цикл, а также клиентский js скрипт, передать методом fetch через body не получилось, передали через заголовок
5 Раздел 5 видео 11 рефакторинг, обработка ошибок, вывод флеш сообщений. ТК в редирект нельзя передавать никакие данные, устанавливаем пакет npm i connect-flash работает через сессии
6  Сервер примет любые данные, поэтому прежде чем с ними работать, данные валидируют на фронтенде, а зате мпо приходу на сервер валидируют на самом сервере Часть 7 курса
7  На странице профиля, форма загрузки файла должна иметь спец атрибут, говорящий о том, что форма работает с файлами <form action="/profile" method="POST" enctype="multipart/form-data">
8 Deploy 
    8.1 Защита ключей
    8.2 Добавление хедеров (к заголовкам херь какуюто добавляет) npm install helmet 
    8.3 Сжимать статические файлы приходящие с сервера npm i compression
    8.4 Деплой на хероку , если аккаунт free то при обновлении картинки аватара, хероку не поменяет статический файл в папке images