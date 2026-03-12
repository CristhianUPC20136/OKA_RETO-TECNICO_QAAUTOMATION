import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import testData from '../data/testData.json'; 

test.describe('Escenarios de Autenticación en Demoblaze', () => {
    // BUENA PRÁCTICA: Ejecutar en orden para flujos que dependen de datos previos
    test.describe.configure({ mode: 'serial' });
    let homePage: HomePage;
    const dynamicUsername = `${testData.user.username}_${Date.now()}`;
    const password = testData.user.password;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.navigate(testData.baseUrl);
    });

    test('Debe crear un usuario nuevo y validar el mensaje de éxito', async ({ page }) => {
        // Usamos page.once para atrapar solo esta alerta
        page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Sign up successful.');
            await dialog.accept();
        });

        await homePage.signUp(dynamicUsername, password);

        
        await page.waitForTimeout(2000);
        
        
        await page.reload();

        await homePage.login(dynamicUsername, password);
        const welcomeText = await homePage.getWelcomeMessage();
        expect(welcomeText).toContain(`Welcome ${dynamicUsername}`);
    });

    test('Debe iniciar sesión exitosamente con un usuario válido', async ({ page }) => {
        await homePage.login(dynamicUsername, password);
        
        
        await page.waitForTimeout(1000);

        const welcomeText = await homePage.getWelcomeMessage();
        expect(welcomeText).toContain(`Welcome ${dynamicUsername}`);
    });

    test('Debe mostrar un error al intentar iniciar sesión con credenciales incorrectas', async ({ page }) => {
        const wrongPassword = 'ClaveIncorrecta123';

        page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Wrong password.');
            await dialog.accept();
        });

        await homePage.login(dynamicUsername, wrongPassword);
        await page.waitForTimeout(1000); 
    });
});