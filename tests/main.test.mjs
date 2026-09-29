import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";


class FakeElement {
    constructor({ dataset = {}, valid = true, willValidate = false } = {}) {
        this.dataset = dataset;
        this.hidden = true;
        this.valid = valid;
        this.value = "";
        this.willValidate = willValidate;
        this.attributes = new Map();
        this.listeners = new Map();
        this.closeCalls = 0;
        this.openCalls = 0;
        this.reportCalls = 0;
        this.resetCalls = 0;
    }

    addEventListener(type, listener) {
        this.listeners.set(type, listener);
    }

    checkValidity() {
        return this.valid;
    }

    close() {
        this.closeCalls += 1;
    }

    dispatch(type, event = {}) {
        this.listeners.get(type)?.(event);
    }

    removeAttribute(name) {
        this.attributes.delete(name);
    }

    reportValidity() {
        this.reportCalls += 1;
    }

    reset() {
        this.resetCalls += 1;
    }

    setAttribute(name, value) {
        this.attributes.set(name, value);
    }

    showModal() {
        this.openCalls += 1;
    }
}


async function loadController({ formValid = true } = {}) {
    const orderDialog = new FakeElement();
    const orderButton = new FakeElement({ dataset: { product: "Товар 2" } });
    const closeButton = new FakeElement();
    const selectedProduct = new FakeElement();
    const invalidField = new FakeElement({ valid: formValid, willValidate: true });
    const orderForm = new FakeElement({ valid: formValid });
    orderForm.elements = [invalidField];
    orderForm.checkValidity = () => formValid;
    const successMessage = new FakeElement();

    const elements = {
        "close-order-dialog": closeButton,
        "order-dialog": orderDialog,
        "order-form": orderForm,
        "selected-product": selectedProduct,
        "success-message": successMessage,
    };
    const document = {
        getElementById: (id) => elements[id],
        querySelectorAll: () => [orderButton],
    };
    const source = await readFile(new URL("../js/main.js", import.meta.url), "utf8");
    vm.runInNewContext(source, { document });

    return {
        closeButton,
        invalidField,
        orderButton,
        orderDialog,
        orderForm,
        selectedProduct,
        successMessage,
    };
}


test("ordering a product selects it and opens the dialog", async () => {
    const page = await loadController();

    page.orderButton.dispatch("click");

    assert.equal(page.selectedProduct.value, "Товар 2");
    assert.equal(page.orderDialog.openCalls, 1);
});


test("invalid submission highlights fields and leaves the dialog open", async () => {
    const page = await loadController({ formValid: false });

    page.orderForm.dispatch("submit", { preventDefault() {} });

    assert.equal(page.invalidField.attributes.get("aria-invalid"), "true");
    assert.equal(page.orderForm.reportCalls, 1);
    assert.equal(page.orderDialog.closeCalls, 0);
});


test("valid submission reports success, resets the form, and closes", async () => {
    const page = await loadController();

    page.orderForm.dispatch("submit", { preventDefault() {} });

    assert.equal(page.successMessage.hidden, false);
    assert.equal(page.orderForm.resetCalls, 1);
    assert.equal(page.orderDialog.closeCalls, 1);
});
