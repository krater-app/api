import { AppError } from '@errors/app.error';
import { Query } from './query';
import { QueryBus } from './query-bus';
import { QueryHandler } from './query-handler';

interface QueryHandlers {
  [key: string]: QueryHandler<any, any>;
}

interface Dependencies {
  queryHandlers: QueryHandler<any, any>[];
}

export class InMemoryQueryBus implements QueryBus {
  private existingQueryHandlers: QueryHandlers = {};

  constructor(dependencies: Dependencies) {
    this.existingQueryHandlers = dependencies.queryHandlers.reduce(
      (queryHandlers: QueryHandlers, currentHandler: QueryHandler<any, any>) => {
        return {
          ...queryHandlers,
          [this.getConstructorName(currentHandler)]: currentHandler,
        };
      },
      {},
    );
  }

  public async handle(query: Query<any>): Promise<unknown> {
    const existingQueryHandler = this.existingQueryHandlers[this.getQueryHandlerName(query)];

    if (!existingQueryHandler) {
      throw new AppError(
        `Query Handler for query: "${this.getConstructorName(query)}" does not exist.`,
      );
    }

    return existingQueryHandler.handle(query);
  }

  private getConstructorName(object: object) {
    return object.constructor.name;
  }

  private getQueryHandlerName(query: Query<any>) {
    return `${this.getConstructorName(query)}Handler`;
  }
}
