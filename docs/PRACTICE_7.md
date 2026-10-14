# Практическое занятие №7

Чернышев Антон Дмитриевич · ЭФБО-02-25

## Аудит до рефакторинга

Карточки и навигация уже частично использовали БЭМ.
Недостатки: site-header был классом внутреннего div, логотип назывался
site-logo; поля и действия формы назывались form-field/form-actions;
хлебные крошки не имели классов элементов; CSS зависел от вложенных
label/input/h2/span и повторял правила отдельных компонентов.
Цена на product.html использовала элемент product-card вне карточки.
Случайных классов red/big и CSS id-селекторов не было.

## Что изменено

| До | После |
| --- | --- |
| header без класса и div.site-header | header.site-header и div.site-header__inner |
| site-logo | site-header__logo |
| form-field и form-actions | order-form__field и order-form__actions |
| .form-field label/input/select/textarea | прямые order-form__label/input/select/textarea |
| .order-dialog h2 | order-dialog__title |
| .breadcrumbs span | breadcrumbs__current |
| ссылка крошек без класса | breadcrumbs__link |
| .site-nav__list li/a | site-nav__item/link |
| aria-current как CSS-селектор | site-nav__link--active; aria-current сохранён для доступности |
| product-grid | products-grid |
| footer без класса | site-footer |
| цена вне карточки с product-card__price | product-details__price внутри product-details |

Фильтры получили filters-form__group/legend/label/input,
таблица — product-table__head/caption/cell. Кнопки получили варианты
button--primary и button--secondary. Карточка с существующим бейджем
получила product-card--featured и тонкую синюю рамку.

## Что показать преподавателю

1. Верхнее меню: site-header — блок, site-header__logo — элемент,
   site-nav__link--active — модификатор текущей ссылки.
2. Карточку «Клавиатура Quiet»: product-card, product-card__title,
   product-card--featured. Та же карточка используется на главной и в каталоге.
3. Нажать «Заказать»: dialog — отдельный блок order-dialog, форма внутри —
   самостоятельный order-form. Подписи и поля имеют классы order-form__….
4. Отправить пустую форму: ошибки видны. Заполнить правильными тестовыми
   данными: показывается демонстрационное сообщение без сетевой отправки.
5. Открыть каталог: хлебные крошки содержат breadcrumbs__link/current.
6. В CSS показать прямые селекторы классов вместо .form-field input.
7. Показать README, коммит, ветку refactor/bem-css-classes и Pull Request.

## Ответы для защиты

БЭМ — блок, элемент, модификатор. Блок можно переиспользовать отдельно:
product-card. Элемент принадлежит блоку: product-card__price.
Модификатор задаёт вариант: product-card--featured.

Два подчёркивания __ отделяют элемент, два дефиса -- — модификатор.
Основной класс не убирают: class="product-card product-card--featured".
Кнопка может совмещать независимый блок button и элемент product-card__button.

Имена описывают назначение, а не цвет: при смене цвета product-card__price
остаётся понятным; имя red перестало бы соответствовать оформлению.
Прямой класс меньше зависит от DOM-вложенности, чем .form-field input.
id нужен для якоря, label for и JS; высокая специфичность id в CSS мешает
переопределению правил. style в HTML смешивает разметку и оформление.

Форма отделена от модального окна, потому что используется также на order.html.
После рефакторинга проверяют JS-селекторы, открытие/закрытие dialog, выбранный
товар, валидацию и состояния фокуса/ошибки. Рефакторинг успешен, если структура
кода стала понятнее, а прежнее поведение и оформление сохранились.

CSS-переменные задают значения оформления; БЭМ задаёт имена компонентов.
Это разные задачи. Проект не получил сервер, оплату или настоящие фильтры.
