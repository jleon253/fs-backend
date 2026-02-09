# fs-backend

Backend ligero en TypeScript (Express + Prisma) para gestionar clientes y cuentas bancarias. Este README explica el scaffolding, las dependencias, la configuración de Prisma, los endpoints disponibles y dónde están centralizados los mensajes en español.

## Visión general
- Servidor Express en TypeScript.
- ORM: Prisma con cliente generado en `src/generated/prisma`.
- Internacionalización simple con mensajes en español en `src/locales/es.json` y helper `t` en [`src/utils/i18n.ts`](src/utils/i18n.ts).
- Entradas/outputs tipadas con tipos basados en el cliente Prisma.

## Quickstart
1. Instalar dependencias:
```sh
npm install
```
2. Configurar variables de entorno en `.env`.
3. Ejecutar en desarrollo:
```sh
npm run dev
```
- El servidor arranca desde [`src/index.ts`](src/index.ts).

## Scripts útiles (package.json)
- `dev`: nodemon para desarrollo y recarga de TypeScript (`npm run dev`). Ver [`package.json`](package.json) para detalles.
- `start`: ejecuta `dist/index.js` (producción) — requiere compilar/transpilar manualmente si aplica.

## Estructura y archivos clave
- Entrada de la app: [`src/index.ts`](src/index.ts)
- Rutas:
  - [`src/routes/index.ts`](src/routes/index.ts)
  - [`src/routes/customerRoutes.ts`](src/routes/customerRoutes.ts)
  - [`src/routes/accountRoutes.ts`](src/routes/accountRoutes.ts)
- Controladores:
  - Clientes: [`src/controllers/customerController.ts`](src/controllers/customerController.ts) — funciones exportadas: [`createCustomer`](src/controllers/customerController.ts), [`getCustomers`](src/controllers/customerController.ts)
  - Cuentas: [`src/controllers/accountController.ts`](src/controllers/accountController.ts) — funciones exportadas: [`createAccount`](src/controllers/accountController.ts), [`getAccounts`](src/controllers/accountController.ts)
- Tipos de cuerpo:
  - [`src/controllers/customerController.type.ts`](src/controllers/customerController.type.ts)
  - [`src/controllers/accountController.type.ts`](src/controllers/accountController.type.ts)
- Prisma:
  - Schema: [`prisma/schema.prisma`](prisma/schema.prisma)
  - Config: [`prisma.config.ts`](prisma.config.ts)
  - Cliente generado: [`src/generated/prisma/client.ts`](src/generated/prisma/client.ts)
  - Wrapper de instancia: [`src/lib/prisma.ts`](src/lib/prisma.ts) — exporta [`prisma`](src/lib/prisma.ts)
- i18n / Mensajes en ES:
  - Fichero de mensajes: [`src/locales/es.json`](src/locales/es.json)
  - Helper: [`src/utils/i18n.ts`](src/utils/i18n.ts) — función [`t`](src/utils/i18n.ts)

## Dependencias principales
(Ver [package.json](package.json) para versiones exactas)
- runtime:
  - express
  - cors
  - dotenv
  - pg
  - @prisma/client
  - @prisma/adapter-pg
- devDependencies:
  - typescript
  - ts-node
  - nodemon
  - prisma
  - @types/express, @types/node, @types/pg, @types/cors

## Prisma — configuración y notas
- El generator en `prisma/schema.prisma` genera el cliente en `../generated/prisma` (ver [`prisma/schema.prisma`](prisma/schema.prisma)).
- `prisma.config.ts` carga variables de entorno con `import "dotenv/config";` y apunta al `schema.prisma` (ver [`prisma.config.ts`](prisma.config.ts)).
- La app utiliza el cliente Prisma adaptado para Postgres en [`src/lib/prisma.ts`](src/lib/prisma.ts) (exporta [`prisma`](src/lib/prisma.ts)).
- Para usar migraciones y comandos Prisma:
  - Instalar la CLI: `npm i -D prisma`
  - Ejecutar migraciones / generar cliente:
    ```sh
    npx prisma migrate dev
    npx prisma generate
    ```

## Endpoints (REST)
- Clientes
  - GET /api/customers
    - Handler: [`getCustomers`](src/controllers/customerController.ts)
    - Ruta: [`src/routes/customerRoutes.ts`](src/routes/customerRoutes.ts)
    - Incluye cuentas asociadas (Prisma `include: { accounts: true }`)
  - POST /api/customers
    - Handler: [`createCustomer`](src/controllers/customerController.ts)
    - Payload: `document_type`, `document_number`, `full_name`, `email` (ver [`CreateCustomerBody`](src/controllers/customerController.type.ts))
- Cuentas
  - GET /api/accounts
    - Handler: [`getAccounts`](src/controllers/accountController.ts)
    - Ruta: [`src/routes/accountRoutes.ts`](src/routes/accountRoutes.ts)
    - Incluye cliente asociado (Prisma `include: { customers: true }`)
  - POST /api/accounts
    - Handler: [`createAccount`](src/controllers/accountController.ts)
    - Payload: `document_number` (ver [`CreateAccountBody`](src/controllers/accountController.type.ts))
    - Lógica: busca cliente por `document_number`, devuelve 404 si no existe, crea cuenta vinculada (`customer_id`).

## Mensajes y internacionalización
- Mensajes en español centralizados en [`src/locales/es.json`](src/locales/es.json).
- Helper de traducción/enmascaramiento: [`t`](src/utils/i18n.ts) — se usa ampliamente en responses de los controladores para mensajes de error y éxito.

## Configuración esperada (.env)
- Variables principales: `PORT`, `DATABASE_URL`.
- La conexión a Postgres se toma desde `DATABASE_URL` que usa el cliente Prisma.

## Buenas prácticas / notas finales
- Revisar y regenerar el cliente Prisma luego de cambios en `prisma/schema.prisma`:
  - `npx prisma generate`
- Manejo de errores y códigos Prisma: se detecta `P2002` (unique constraint) en controladores.
- Añadir validaciones adicionales y tests según necesidades.
- Para producción, compilar/transpilar TS y ejecutar `node dist/index.js` (configuración de build no incluida por defecto).
