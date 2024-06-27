const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Fire Alarm Monitoring System',
      version: '1.0.0',
      description: 'This API provides endpoints for managing floor plans, user profiles, and authentication for a Fire Alarm Monitoring System. It allows users to register and update floor plans, view user profiles, and authenticate through signup, signin, and token refresh mechanisms.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'accessToken',
          },
        },
      },
      security: [ 
        {
          bearerAuth: [],
        },
      ],
  },
  apis: ['./Routes/*/*.js', './Controllers/*/*.js'], // Adjust paths as needed
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
