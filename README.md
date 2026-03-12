# Reto Técnico - QA Automation - Cristhian Zaña Ramirez

Este repositorio contiene la solución al reto técnico de automatización de pruebas UI utilizando **Playwright** y **TypeScript** sobre la página [Demoblaze](https://www.demoblaze.com/index.html).

## Decisiones Técnicas y Arquitectura

Para garantizar un framework escalable, mantenible y robusto, se tomaron las siguientes decisiones de diseño:

* **Page Object Model (POM):** Se separó la lógica de interacción con la UI (localizadores y métodos) de la lógica de negocio (aserciones y flujos de prueba). Las clases se encuentran en la carpeta `/pages`.
* **Datos de Prueba Externos:** Los datos de prueba (usuarios, contraseñas, datos de compra) se extrajeron a un archivo JSON en la carpeta `/data/testData.json` para no hardcodear datos en los scripts.
* **Usuarios Dinámicos:** Para el registro, se genera un `username` dinámico basado en el *timestamp* actual (`Date.now()`), garantizando que la prueba sea repetible sin generar conflictos en la base de datos de Demoblaze.**Fue uno de los principales retos que tuve, ya que antes en cada iteración me impedia reutilizar el username ya que lo detectaba como registrado**

* **Manejo de Tiempos y Esperas:** Se priorizó el uso de esperas dinámicas (`locator.waitFor()`) y validación de visibilidad de elementos (`toBeVisible()`, `toBeHidden()`).

* **Test Isolation vs. Serial Mode:** Se agrupó el flujo de Autenticación en modo `serial` para respetar la dependencia de datos (el Login depende de un Registro exitoso previo en la misma ejecución), mientras que el flujo de tienda (`shop.spec.ts`) se maneja de forma End-to-End (E2E).

## Requisitos Previos

* [Node.js](https://nodejs.org/) (v16 o superior)
* npm (incluido con Node.js)

## Instalación

1. Clonar el repositorio:
   git clone <https://github.com/CristhianUPC20136/OKA_RETO-TECNICO_QAAUTOMATION.git>

2. Instalar las dependencias del proyecto:
   npm install

3. Instalar los navegadores de Playwright:
   npx playwright install