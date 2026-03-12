import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import testData from '../data/testData.json';

test.describe('Escenarios de Compra en Demoblaze', () => {
    
    let homePage: HomePage;
    let productPage: ProductPage;
    let cartPage: CartPage;

    // Inicializamos las páginas y navegamos antes de la prueba
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        await homePage.navigate(testData.baseUrl);
    });

    test('Flujo E2E: Añadir productos de varias categorías, eliminar uno y comprar', async ({ page }) => {
        
        // ESCENARIO 3: Añadir productos de diferentes categorías 
        
        // 1. Categoría Phones: Samsung galaxy s6
        await homePage.selectCategory('Phones');
        await homePage.selectProduct('Samsung galaxy s6');
        await productPage.addToCart();
        
        // Volvemos a la página principal para seguir comprando
        await homePage.navigate(testData.baseUrl);

        // 2. Categoría Laptops: Sony vaio i5
        await homePage.selectCategory('Laptops');
        await homePage.selectProduct('Sony vaio i5');
        await productPage.addToCart();

        await homePage.navigate(testData.baseUrl);

        // 3. Categoría Monitors: Apple monitor 24
        await homePage.selectCategory('Monitors');
        await homePage.selectProduct('Apple monitor 24');
        await productPage.addToCart();

        // ESCENARIO 4: Eliminar productos
        
        // Vamos al carrito de compras
        await cartPage.goToCart();
        
        // Nos arrepentimos de la laptop, la eliminamos por su nombre exacto
        await cartPage.deleteProduct('Sony vaio i5');

        // VALIDACIÓN: Verificamos que el producto ya no esté en la tabla
        // Usamos .isHidden() para asegurar que la fila desapareció del DOM
        const laptopRow = page.locator('tr:has-text("Sony vaio i5")');
        await expect(laptopRow).toBeHidden();

        // ESCENARIO 5: Finalizar compra del carrito 
        
        // Hacemos clic en Place Order y llenamos el formulario con los datos de nuestro JSON
        const order = testData.orderData;
        await cartPage.placeOrder(
            order.name, 
            order.country, 
            order.city, 
            order.card, 
            order.month, 
            order.year
        );

        // Validamos que aparezca el check verde y el mensaje de "Thank you"
        await cartPage.validateSuccessfulPurchase();
    });
});