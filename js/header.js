// Высота меню меняется при переносе ссылок: якоря не должны попадать под шапку.
const pageHeader = document.querySelector('body > header');
if (pageHeader) {
    const updateHeaderHeight = () => {
        document.documentElement.style.setProperty('--header-height', pageHeader.getBoundingClientRect().height + 'px');
    };
    updateHeaderHeight();
    new ResizeObserver(updateHeaderHeight).observe(pageHeader);
}
