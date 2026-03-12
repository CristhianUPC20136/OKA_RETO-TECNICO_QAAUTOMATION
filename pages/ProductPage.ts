import { Page } from '@playwright/test';

export class ProductPage {
    readonly page: Page;
    // Localizador del botón para añadir al carrito
    readonly addToCartButton = 'a:has-text("Add to cart")';

    constructor(page: Page) {
        this.page = page;
    }

    // Método para añadir al carrito y manejar la alerta de confirmación
    async addToCart() {
        // Usamos page.once para que escuche la alerta UNA SOLA VEZ por cada clic.
        this.page.once('dialog', async dialog => {
            await dialog.accept();
        });
        
        // Hacemos clic en el botón
        await this.page.click(this.addToCartButton);
        // Le damos un momento para que la alerta se dispare y se cierre
        await this.page.waitForTimeout(1000); 
    }
}