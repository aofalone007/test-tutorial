import { test, expect } from '../fixtures/fixtures';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CUSTOMER, PRODUCTS } from '../data/test-data';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(PRODUCTS.backpack);
    await loggedIn.addToCart(PRODUCTS.boltTShirt);
    await loggedIn.openCart();
    await cartPage.checkout();
  });

  test('TC08 - E2E สั่งซื้อสำเร็จ', async ({ page, checkoutPage, inventoryPage }) => {
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutPage.itemNames).toHaveText([PRODUCTS.backpack, PRODUCTS.boltTShirt]);

    await checkoutPage.finishButton.click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(inventoryPage.cartBadge).toBeHidden();

    await checkoutPage.backHomeButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC09 - ยอดรวม = subtotal + tax และ subtotal = ผลรวมราคาสินค้า', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);

    const prices = (await checkoutPage.itemPrices.allTextContents()).map(CheckoutPage.money);
    const itemSum = prices.reduce((a, b) => a + b, 0);
    const subtotal = CheckoutPage.money(await checkoutPage.subtotal.textContent());
    const tax = CheckoutPage.money(await checkoutPage.tax.textContent());
    const total = CheckoutPage.money(await checkoutPage.total.textContent());

    expect(subtotal).toBeCloseTo(itemSum, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

});
