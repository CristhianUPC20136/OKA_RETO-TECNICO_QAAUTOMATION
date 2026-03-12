import { Page } from '@playwright/test';

export class HomePage {
    readonly page: Page;

    readonly signUpMenu = '#signin2';
    readonly signUpUsernameInput = '#sign-username';
    readonly signUpPasswordInput = '#sign-password';
    readonly signUpButton = 'button[onclick="register()"]';

    readonly loginMenu = '#login2';
    readonly loginUsernameInput = '#loginusername';
    readonly loginPasswordInput = '#loginpassword';
    readonly loginButton = 'button[onclick="logIn()"]';
    
    readonly welcomeUserText = '#nameofuser';

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string) {
        await this.page.goto(url);
    }

    async signUp(username: string, password: string) {
        await this.page.click(this.signUpMenu);
        await this.page.waitForTimeout(500); 
        await this.page.waitForSelector(this.signUpUsernameInput, { state: 'visible' });
        await this.page.fill(this.signUpUsernameInput, username);
        await this.page.fill(this.signUpPasswordInput, password);
        await this.page.click(this.signUpButton);
    }

    async login(username: string, password: string) {
        await this.page.click(this.loginMenu);
        await this.page.waitForTimeout(500);
        await this.page.waitForSelector(this.loginUsernameInput, { state: 'visible' });
        await this.page.fill(this.loginUsernameInput, username);
        await this.page.fill(this.loginPasswordInput, password);
        await this.page.click(this.loginButton);
    }

    async getWelcomeMessage() {
        const welcomeLocator = this.page.locator(this.welcomeUserText);
        await welcomeLocator.waitFor({ state: 'visible' });
        return await welcomeLocator.textContent();
    }

    // --- MÉTODOS PARA LAS CATEGORÍAS ---

    async selectCategory(categoryName: string) {
        await this.page.getByRole('link', { name: categoryName, exact: true }).click();
        // Pausa para que Demoblaze filtre visualmente los productos
        await this.page.waitForTimeout(1000); 
    }

    async selectProduct(productName: string) {
        await this.page.getByRole('link', { name: productName }).click();
    }
}