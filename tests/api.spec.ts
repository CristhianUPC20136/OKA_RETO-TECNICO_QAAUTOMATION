import { test, expect } from '@playwright/test';

// Configuramos el modo serial para que las pruebas se ejecuten estrictamente en orden
test.describe.configure({ mode: 'serial' });

test.describe('Escenarios de API - PetStore', () => {
    const baseUrl = 'https://petstore.swagger.io/v2';
    
    // Declaramos las variables afuera para que todas las pruebas (tests) las compartan
    let orderId: number;
    let orderPayload: any;

    // test.beforeAll se ejecuta UNA SOLA VEZ antes de empezar la primera prueba
    test.beforeAll(() => {
        // Generamos el ID dinámico aquí para garantizar que sea exactamente el mismo para todo el flujo
        orderId = Math.floor(Math.random() * 10000) + 1;
        orderPayload = {
            id: orderId,
            petId: 1987,
            quantity: 2,
            shipDate: new Date().toISOString(),
            status: "placed",
            complete: true
        };
    });

    // 1. CREACIÓN
    test('Debe crear una nueva orden de mascota y retornar HTTP 200', async ({ request }) => {
        const response = await request.post(`${baseUrl}/store/order`, {
            data: orderPayload
        });

        // Validamos el HTTP 200 y la creación correcta
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.id).toBe(orderId);
    });

    // 2. OBTENCIÓN 
    test('Debe obtener la orden recién creada por su ID y validar la respuesta', async ({ request }) => {
        const response = await request.get(`${baseUrl}/store/order/${orderId}`);

        // Validamos HTTP 200
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.id).toBe(orderId);
        expect(responseBody.petId).toBe(1987);
    });

    // 3. ELIMINACIÓN
    test('Debe eliminar la orden y validar su inexistencia posterior', async ({ request }) => {
        // Ejecutamos la eliminación
        const deleteResponse = await request.delete(`${baseUrl}/store/order/${orderId}`);
        expect(deleteResponse.status()).toBe(200);

        // Validación de inexistencia
        const getResponse = await request.get(`${baseUrl}/store/order/${orderId}`);
        // Ahora sí, esperamos correctamente un 404 porque acabamos de borrarla
        expect(getResponse.status()).toBe(404);
        
        const getResponseBody = await getResponse.json();
        expect(getResponseBody.message).toBe("Order not found");
    });
});