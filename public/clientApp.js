const toCurrency = (price) => {
  return new Intl.NumberFormat("ru-RU", {
    currency: "rub",
    style: "currency",
  }).format(price);
};

document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

const toDate = (date) => {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
};

document.querySelectorAll(".date").forEach((node) => {
  node.textContent = toDate(node.textContent);
});

const $card = document.querySelector("#card");
if ($card) {
  $card.addEventListener("click", (event) => {
    if (event.target.classList.contains("js-remove")) {
      const id = event.target.dataset.id;
      // для пакета csurf
      const csrf = event.target.dataset.csrf;
      // метод фетч у джаваскрипт
      // Задача передать переменную csurf, 1 вар через body у нас не получилось, 2 ой вар в заголовке запроса
      fetch("/card/remove/" + id, {
        method: "delete",
        header: {
          "X-XSRF-TOKEN": csrf,
        },
        // body: JSON.stringify({
        //   // Это делаем для пакета csurf через body у нас не получилось
        //   _csrf: csrf,
        //}),
      })
        .then((res) => res.json())
        .then((card) => {
          if (card.courses.length) {
            const html = card.courses
              .map((c) => {
                return `
              <tr>
                <td>${c.title}</td>
                <td>${c.count}</td>
                <td>
                  <button class="btn btm-small js-remove" data-id="${c._id}">Удалить</button>
                </td>
              </tr>
              `;
              })
              .join("");
            $card.querySelector("tbody").innerHTML = html;
            $card.querySelector(".price").textContent = toCurrency(card.price);
          } else {
            $card.innerHTML = "<p>Корзина пуста</p>";
          }
        });
    }
  });
}

M.Tabs.init(document.querySelectorAll(".tabs"));
