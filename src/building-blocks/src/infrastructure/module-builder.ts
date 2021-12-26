import { Controller } from '@api/controller';
import { EventDispatcher } from '@app/event-dispatcher';
import { AwilixContainer } from 'awilix';
import { Application } from 'express';
import { DomainEvent } from '..';
import { UnitOfWork } from './unit-of-work';

export interface AppModule {
  name: string;
  registerControllers(app: Application): void;
  dispatchEvent(event: DomainEvent): Promise<void>;
}

export class ModuleBuilder {
  private name: string;

  private container: AwilixContainer;

  public setName(name: string) {
    this.name = name;

    return this;
  }

  public setContainer(container: AwilixContainer) {
    this.container = container;

    return this;
  }

  public build(): AppModule {
    const controllers = this.container.resolve<Controller[]>('controllers');

    return {
      name: this.name,
      registerControllers: (app: Application) =>
        controllers.map((controller) => app.use(controller.route, controller.getRouter())),
      dispatchEvent: async (event: DomainEvent) => {
        const eventDispatcher = this.container.resolve<EventDispatcher>('eventDispatcher');
        const unitOfWork = this.container.resolve<UnitOfWork>('unitOfWork');

        await unitOfWork.start();

        await unitOfWork.complete(async () => eventDispatcher.dispatchEvent(event, unitOfWork));
      },
    };
  }
}