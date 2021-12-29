import { QueryBuilder } from '@krater/database';
import { AppModule, Logger, NotFoundError } from '@krater/building-blocks';
import express, { Application } from 'express';
import * as swaggerUI from 'swagger-ui-express';
import { swaggerDocs } from '@infrastructure/swagger/swagger';
import corsMiddleware from './middlewares/cors/cors.middleware';
import { applySecurityMiddleware } from './middlewares/security/security.middleware';
import { errorHandlerMiddleware } from './middlewares/error-handler/error-handler.middleware';

interface Dependencies {
  queryBuilder: QueryBuilder;
  logger: Logger;
  modules: AppModule[];
}

export class Server {
  private readonly app: Application;

  constructor(dependencies: Dependencies) {
    this.app = express();

    this.app.use(express.json());

    this.app.use(corsMiddleware);

    applySecurityMiddleware(this.app);

    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

    dependencies.modules.forEach((module) => module.registerControllers(this.app));

    this.app.use('*', (req, _, next) =>
      next(new NotFoundError(`Route "${req.originalUrl}" does not exist.`)),
    );

    this.app.use(errorHandlerMiddleware(dependencies.logger));
  }

  public getApp(): Readonly<Application> {
    return this.app;
  }
}
