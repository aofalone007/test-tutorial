import { test, expect } from '../fixtures/fixtures';
import { PRODUCTS } from '../data/test-data';

test.describe('Cart', () => {
 
  test('TC06 - เพิ่มหลายชิ้นแล้วตรวจในตะกร้า', async ({ loggedIn, cartPage }) => {
    const picks = [PRODUCTS.backpack, PRODUCTS.bikeLight, PRODUCTS.onesie];
    for (const p of picks) await loggedIn.addToCart(p);
    await expect(loggedIn.cartBadge).toHaveText('3');

    await loggedIn.openCart();
    await expect(cartPage.items).toHaveCount(3);
    await expect(cartPage.itemNames).toHaveText(picks);
  });


  test('TC07 - ลบสินค้าจากหน้าตะกร้า', async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(PRODUCTS.backpack);
    await loggedIn.addToCart(PRODUCTS.bikeLight);
    await loggedIn.openCart();
    await cartPage.remove(PRODUCTS.backpack);
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.itemNames).toHaveText([PRODUCTS.bikeLight]);
  });

});
