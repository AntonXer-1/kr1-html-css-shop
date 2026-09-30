# DeskSupply — учебный магазин аксессуаров

Контрольная работа №1: **HTML и CSS, разработка многостраничного сайта**.
Проект продолжает практические занятия №1–4 (часть 1 из 2).

Автор: **Чернышев Антон Дмитриевич**, группа **ЭФБО-02-25**.
Дисциплина: «Фронтенд и бэкенд разработка».

[Открыть сайт](https://antonxer-1.github.io/kr1-html-css-shop/) ·
[Репозиторий для сдачи в СДО](https://github.com/AntonXer-1/kr1-html-css-shop) ·
[Вопросы и ответы для защиты](docs/DEFENSE.md)

## О проекте

DeskSupply — статический каталог аксессуаров для рабочего места:
клавиатуры Quiet, мыши Motion и наушников Focus.
Пять отдельных HTML-страниц используют общий CSS и единую навигацию.

Это учебная демонстрация: модели, характеристики, цены и контакты магазина
вымышленные. Заказов, оплаты, сервера и базы данных нет. Форма проверяет
ввод в браузере, **не отправляет и не сохраняет данные**.
Кнопка «Фильтры — позже» намеренно disabled: фильтрация не реализована.

## Страницы

| Страница | Что реализовано |
| --- | --- |
| [Главная](index.html) | Первый экран, преимущества, три товара, FAQ, модальное окно заявки |
| [Каталог](catalog.html) | Сетка карточек, категории, подробности мыши и наушников |
| [Товар](product.html) | Клавиатура Quiet, цена, описание, таблица характеристик |
| [Заявка](order.html) | Отдельная форма с подписями, типами полей и валидацией |
| [Контакты](contacts.html) | Демонстрационные контакты, информация об авторе, FAQ |

## Структура

```text
kr1-html-css-shop/
├── index.html
├── catalog.html
├── product.html
├── order.html
├── contacts.html
├── css/style.css          # общие стили, переменные, БЭМ
├── js/main.js             # dialog и проверка формы
├── images/                # локальные SVG-иллюстрации
├── tests/                 # структура HTML, JS и Chromium
├── docs/DEFENSE.md         # 22 вопроса, понятия и сценарий показа
├── docs/superpowers/       # спецификация и план
├── .gitignore
└── README.md
```

## Технологии и запуск

HTML5, CSS3, минимальный JavaScript без библиотек.
Без CSS-фреймворков, npm-сборки и сторонних шрифтов.

Можно открыть `index.html` непосредственно в браузере или в VS Code
запустить Live Server. Альтернатива при установленном Python:

```bash
python3 -m http.server 8000
```

Открыть `http://localhost:8000`. GitHub Pages публикует файлы из ветки
`main`, папки `/ (root)`.

## Карта требований контрольной работы

| Требование | Где искать / что показать |
| --- | --- |
| Многостраничный сайт | Пять HTML-файлов в корне; перейти по пунктам меню |
| Корректная структура | На каждой странице doctype, lang, head, body, title, один main |
| Семантика | header/nav/main/footer везде; section/article/aside на главной и в каталоге |
| Общая навигация | `.site-nav__list`; текущая ссылка имеет `aria-current="page"` |
| Якоря | `#popular`, `#advantages`, `#contacts`, `#specifications`, `#mouse-details` |
| Карточки товаров | `article.product-card`: иллюстрация, заголовок, описание, цена, ссылка |
| Таблица | product.html: caption, thead, tbody, th со scope, td |
| Форма заявки | order.html и dialog главной: имя, email, tel, тема, комментарий, согласие |
| Подписи и проверка | label/for/id, name, required, type=email, minlength, pattern телефона |
| Модальное окно | index.html: dialog; js/main.js: showModal/close; CSS ::backdrop |
| Внешний CSS | css/style.css подключён на всех страницах |
| CSS-переменные | `:root`; `var(--color-primary)`, токены цвета/отступов/радиусов |
| Состояния | :hover, :focus-visible; disabled-кнопка в каталоге |
| Flexbox | `.site-header__inner`, `.site-nav__list`, `.product-card__actions` |
| CSS Grid | `.product-grid`, `.catalog-layout`, `.product-detail`, `.order-layout` |
| БЭМ | product-card / product-card__title; button / button--secondary |
| Позиционирование | relative: visual; absolute: badge; sticky: header/sidebar; fixed: back-top |
| Слои | z-index шапки, бейджа, ссылки наверх и сообщения; dialog в top layer |
| Документация | Этот README, docs/DEFENSE.md |
| Публикация | Ссылка GitHub Pages в начале README |
| Ссылка для СДО | Ссылка на репозиторий в начале README; отправляется студентом |

## Собственные улучшения

Не только замена текста и цветов:

- Собственная предметная область, три содержательных товара и локальные SVG.
- Полная структура из пяти страниц с подсветкой текущего раздела.
- Хлебные крошки и реальные переходы к характеристикам каждого товара.
- FAQ на details/summary, работающий без JavaScript.
- Таблица с caption и scope; доступные подписи и видимый фокус.
- Состояния ошибки формы, честное сообщение результата без ложной «отправки».
- Категории каталога и закреплённая боковая панель.
- Базовая защита от переполнения на узких экранах и prefers-reduced-motion.
- Автоматические проверки структуры, переходов, формы и CSS в Chromium.

Полноценная адаптация, корзина, фильтры, серверная обработка и SPA оставлены
для дальнейших работ. Неизвестное устное «2 из 3» не использовано для
исключения обязательных требований PDF.

## Что сохранилось из практик

1. Структура проекта, Git/GitHub и публикация.
2. Семантические теги, четыре meta (charset, viewport, description, author),
   якоря и карточки.
3. dialog, type=text/email/tel/date/hidden/checkbox, select, textarea,
   label, required, minlength, pattern.
4. Внешний CSS, переменные, состояния кнопок/полей, валидация, box-sizing.

На отдельной странице выбранный товар представлен select; в модальном окне
— скрытым input type=hidden, заполненным из data-product.
Hidden не является защитой: его значение можно изменить в DevTools.

## Проверки

При установленном Python:

```bash
python3 -m unittest discover -s tests -p 'test_*.py'
```

JS без дополнительных зависимостей:

```bash
node --test tests/main.test.mjs
```

Для браузерных тестов нужны Node.js, доступный модуль Playwright и Chromium:

```bash
node --test tests/main.test.mjs tests/styles.test.mjs tests/multipage.test.mjs
```

12 Python-тестов и 13 Node/Chromium-тестов.
Проверяются пять маршрутов, ссылки и изображения, форма без сетевой отправки,
сброс ошибок при повторном открытии, Flex/Grid, фокус, ошибки и disabled,
отсутствие горизонтального переполнения при ширине 375 px.

## Как показать новый коммит README

Откройте историю файла README на GitHub и коммит
`docs: document KR1 requirements and defense answers`.
В изменениях видны новый README и памятка защиты.

Локально:

```bash
git log --oneline -- README.md
git show --stat --oneline HEAD
```

Коммит хранит снимок изменений локально; push отправляет его на GitHub.
После слияния в main обновляется опубликованный сайт.
