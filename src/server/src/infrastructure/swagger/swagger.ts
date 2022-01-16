import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const modules = ['platform-access', 'news-feed', 'file-system'];

export const swaggerDocs = swaggerJSDoc({
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Krater API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-auth-token',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: modules.map((module) =>
    path.join(
      __dirname,
      '..',
      '..',
      '..',
      `node_modules/@krater/${module}/dist/api/**/*.action.js`,
    ),
  ),
});
