import { test, expect } from '../fixtures/fixtures';
import { USERS, PASSWORD } from '../data/test-data';

test.describe('Test Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC01 - login สำเร็จด้วย standard_user', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard, PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('TC02 - locked_out_user ถูกบล็อก', async ({ loginPage }) => {
    await loginPage.login(USERS.lockedOut, PASSWORD);
    await expect(loginPage.error).toContainText('Sorry, this user has been locked out.');
  });

  test('TC03 - รหัสผ่านผิด', async ({ loginPage }) => {
    await loginPage.login(USERS.standard, 'wrong_password');
    await expect(loginPage.error).toContainText(
      'Username and password do not match any user in this service',
    );
  });

  test('TC04 - ไม่กรอก username', async ({ loginPage }) => {
    await loginPage.login('', PASSWORD);
    await expect(loginPage.error).toContainText('Username is required');
  });

  test('TC05 - ไม่กรอก password', async ({ loginPage }) => {
    await loginPage.login(USERS.standard, '');
    await expect(loginPage.error).toContainText('Password is required');
  });

});
