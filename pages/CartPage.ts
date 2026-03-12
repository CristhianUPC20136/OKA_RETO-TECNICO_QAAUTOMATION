import { Page, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    
    // Localizadores usando la sintaxis moderna y robusta de Playwright
    readonly cartMenu = '#cartur';
    readonly placeOrderButton = 'button:has-text("Place Order")';
    
    // Modal de compra
    readonly nameInput = '#name';
    readonly countryInput = '#country';
    readonly cityInput = '#city';
    readonly cardInput = '#card';
    readonly monthInput = '#month';
    readonly yearInput = '#year';
    readonly purchaseButton = 'button:has-text("Purchase")';
    
    // Mensaje de éxito
    readonly successMessage = 'h2:has-text("Thank you for your purchase!")';
    readonly okButton = 'button:has-text("OK")';

    constructor(page: Page) {
        this.page = page;
    }

    // Navegar al carrito
    async goToCart() {
        await this.page.locator(this.cartMenu).click();
        // LECCIÓN APLICADA: El carrito de Demoblaze tarda un momento en cargar la tabla
        await this.page.waitForTimeout(1500); 
    }

    // Método dinámico para eliminar cualquier producto por su nombre
    async deleteProduct(productName: string) {
        // Buscamos la fila exacta que contiene el nombre del producto y hacemos clic en su botón "Delete"
        const productRow = this.page.locator(`tr:has-text("${productName}")`);
        await productRow.locator('a:has-text("Delete")').click();
        
        // LECCIÓN APLICADA: Esperamos a que la web actualice la tabla y desaparezca el producto
        await this.page.waitForTimeout(1500);
    }

    // Completar el formulario de compra
    async placeOrder(name: string, country: string, city: string, card: string, month: string, year: string) {
        await this.page.locator(this.placeOrderButton).click();
        
        // LECCIÓN APLICADA: Esperamos explícitamente a que el modal sea visible antes de escribir
        await this.page.locator(this.nameInput).waitFor({ state: 'visible' });
        
        await this.page.locator(this.nameInput).fill(name);
        await this.page.locator(this.countryInput).fill(country);
        await this.page.locator(this.cityInput).fill(city);
        await this.page.locator(this.cardInput).fill(card);
        await this.page.locator(this.monthInput).fill(month);
        await this.page.locator(this.yearInput).fill(year);
        
        await this.page.locator(this.purchaseButton).click();
    }

    // Validar que la compra fue exitosa
    async validateSuccessfulPurchase() {
        // Verificamos que aparezca el "Thank you for your purchase!"
        const successMsg = this.page.locator(this.successMessage);
        await successMsg.waitFor({ state: 'visible' });
        
        // Aserción para asegurar la calidad de la prueba
        await expect(successMsg).toBeVisible();
        await this.page.locator(this.okButton).click();
    }
}