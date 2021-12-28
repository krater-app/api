import { QueryBuilder, UnitOfWork } from '@krater/database';
import { AppModule, Logger, NotFoundError } from '@krater/building-blocks';
import express, { Application } from 'express';

interface Dependencies {
  queryBuilder: QueryBuilder;
  logger: Logger;
  unitOfWork: UnitOfWork;
  modules: AppModule[];
}

export class Server {
  private readonly app: Application;

  constructor(dependencies: Dependencies) {
    this.app = express();

    this.app.use(express.json());

    dependencies.modules.forEach((module) => module.registerControllers(this.app));

    this.app.use('*', (req, _, next) =>
      next(new NotFoundError(`Route "${req.originalUrl}" does not exist.`)),
    );
  }

  public getApp(): Readonly<Application> {
    return this.app;
  }
}
