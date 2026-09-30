# Учебный интернет-магазин ShopProject

Контрольная работа №1: многостраничный сайт на HTML и CSS.
Продолжение практических занятий №1–4.

Автор: **Чернышев Антон Дмитриевич**, группа **ЭФБО-02-25**.
Дисциплина: «Фронтенд и бэкенд разработка».

[Сайт на GitHub Pages](https://antonxer-1.github.io/kr1-html-css-shop/) ·
[Репозиторий для сдачи](https://github.com/AntonXer-1/kr1-html-css-shop) ·
[Ответы для защиты](docs/DEFENSE.md)

## Структура и страницы

- `index.html` — главная, преимущества, карточки, модальное окно.
- `catalog.html` — каталог трёх товаров и краткие описания.
- `product.html` — клавиатура и таблица характеристик.
- `order.html` — отдельная форма заявки.
- `contacts.html` — демонстрационные контакты и автор.
- `css/style.css` — общие стили.
- `js/main.js` — открытие dialog и проверка формы.
- `tests/` — проверки структуры, формы и CSS.

Технологии: HTML5, CSS3, минимальный JavaScript.
Без фреймворков и сборщика. Оформление сохранено на уровне практических работ:
Arial, синие кнопки, светлый фон и простые рамки.

## Что реализовано и где показать

| Требование | Пример в проекте |
| --- | --- |
| Пять связанных страниц | Меню на каждой странице |
| Семантика | header, nav, main, section, article, aside, footer |
| Один main, title, meta | Структура каждой HTML-страницы |
| Якорные ссылки | #popular, #advantages, #contacts, #specifications |
| Карточки | article.product-card: название, описание, цена, действия |
| Таблица | product.html: caption, thead, tbody, th scope, td |
| Форма | Имя, email, tel, дата, тема, комментарий, согласие |
| Подписи и валидация | label/for/id, name, required, minlength, pattern |
| Модальное окно | dialog на главной, showModal/close в JS |
| CSS-переменные | :root и var(--color-primary) |
| Состояния | :hover, :focus-visible, disabled, aria-invalid |
| Flexbox | site-nav__list, product-card__actions, form-actions |
| Grid | product-grid — три колонки карточек |
| БЭМ | product-card__title, product-card__price, button--secondary |
| relative и absolute | Карточка и её бейдж «Популярный» |
| fixed и z-index | Ссылка «Наверх» и сообщение проверки формы |
| README и публикация | Этот файл и ссылка GitHub Pages |

Дополнения к практикам: многостраничная навигация, сетка каталога,
таблица характеристик, БЭМ-классы и фиксированная ссылка наверх.
Без рекламных блоков и сложного оформления.

**Важно:** сайт учебный. Товары, цены и контакты демонстрационные.
Форма не отправляет и не сохраняет данные; сервера, корзины и оплаты нет.
Hidden-поле в модальном окне содержит выбранный товар, но не является защитой.
На отдельной странице товар можно выбрать через select.

## Запуск

Откройте `index.html` в браузере или используйте Live Server в VS Code.
При установленном Python можно запустить из папки проекта:

```bash
python3 -m http.server 8000
```

Затем открыть `http://localhost:8000`.
GitHub Pages публикует ветку main, папку / (root).

## Проверки

```bash
python3 -m unittest discover -s tests -p 'test_*.py'
node --test tests/main.test.mjs
```

Браузерные тесты требуют доступного модуля Playwright и Chromium:

```bash
node --test tests/*.test.mjs
```

12 Python-тестов и 15 JS/Chromium-тестов проверяют структуру, переходы,
форму, состояния CSS и отсутствие переполнения при ширине 375 px.

## Как показать коммит README

На GitHub открыть историю README и коммит
`docs: update README for simple KR1 and defense guide`.
Локально: `git log --oneline -- README.md`.

Коммит — снимок изменений в Git, push — отправка на GitHub.
Ссылку на репозиторий для СДО студент отправляет самостоятельно.
