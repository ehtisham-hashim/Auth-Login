import { createRequire } from 'module';
const require = createRequire(import.meta.url);
export const swaggerUi = require('swagger-ui-express');

export const swaggerDocument = {
  openapi: '3.0.0',
  info: { title: 'Auth API', version: '1.0.0' },
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
  paths: {
    '/auth/signup': { 
      post: { 
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } } },
        responses: { '201': { description: 'Created' } } 
      } 
    },
    '/auth/login': { 
      post: { 
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } } },
        responses: { '200': { description: 'OK' } } 
      } 
    },
    '/auth/logout': { post: { security: [{ bearerAuth: [] }], responses: { '204': { description: 'No Content' } } } },
    '/protected/profile': { get: { security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' } } } },
    '/protected/dashboard': { get: { security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' } } } }
  }
};
