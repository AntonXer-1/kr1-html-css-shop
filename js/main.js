const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');
const selectedProductName = document.getElementById('selected-product-name');

function clearValidation() {
    Array.from(orderForm.elements).forEach((element) => {
        if (element.willValidate) {
            element.removeAttribute('aria-invalid');
        }
    });
}

orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (!orderDialog || !orderForm) return;
        orderForm.reset();
        clearValidation();
        selectedProductInput.value = button.dataset.product;
        if (selectedProductName) {
            selectedProductName.textContent = button.dataset.product;
        }
        successMessage.hidden = true;
        orderDialog.showModal();
    });
});

closeDialogButton?.addEventListener('click', () => {
    orderDialog.close();
});

orderForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    successMessage.hidden = true;

    const formElements = Array.from(orderForm.elements);
    clearValidation();

    if (!orderForm.checkValidity()) {
        formElements.forEach((element) => {
            if (element.willValidate && !element.checkValidity()) {
                element.setAttribute('aria-invalid', 'true');
            }
        });
        orderForm.reportValidity();
        return;
    }

    successMessage.hidden = false;
    orderForm.reset();
    orderDialog?.close();
});

// Разрешаем проверку только после подключения обработчика без сетевой отправки.
const submitButton = document.getElementById('submit-order');
if (submitButton) {
    submitButton.disabled = false;
}
