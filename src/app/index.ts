import express from 'express';
import type Express from 'express';
import ApiResponse from './utils/api-response.js';

export function createExpressApplication(): Express.Application {
  const app = express();

  //middlewarres
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    console.log(`API Endpoint: ${req.method} ${req.originalUrl}`);
    next();
  });

  //routes
  app.get('/', (req, res) => {
    ApiResponse.ok(res, 'Welcome to the API');
  });

  return app;
}
