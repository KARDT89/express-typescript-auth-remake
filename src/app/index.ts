import express from 'express';
import type Express from 'express';

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
    res.send('Hello World!');
  });

  return app;
}
