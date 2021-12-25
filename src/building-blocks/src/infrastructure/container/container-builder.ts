import { Controller } from '@api/controller';
import { EventSubscriber } from '@app/event-subscriber';
import { InMemoryEventDispatcher } from '@app/in-memory-event-dispatcher';
import { asClass, asFunction, AwilixContainer, createContainer, Lifetime, Resolver } from 'awilix';
import { CommandHandler, InMemoryCommandBus, InMemoryQueryBus, QueryHandler } from '../..';
import { registerAsArray } from './register-as-array';

export class ContainerBuilder {
  private container: AwilixContainer;

  constructor() {
    this.container = createContainer();
  }

  public setCommandHandlers(commandHandlers: Resolver<CommandHandler<any, any>>[]) {
    this.container.register({
      commandBus: asClass(InMemoryCommandBus).singleton(),
    });

    this.container.register({
      commandHandlers: registerAsArray(commandHandlers),
    });

    return this;
  }

  public setQueryHandlers(queryHandlers: Resolver<QueryHandler<any, any>>[]) {
    this.container.register({
      queryBus: asClass(InMemoryQueryBus).singleton(),
    });

    this.container.register({
      queryHandlers: registerAsArray(queryHandlers),
    });

    return this;
  }

  public loadActions(actionsPattern: string[]) {
    this.container.loadModules(actionsPattern, {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: Lifetime.SCOPED,
        register: asFunction,
      },
    });

    return this;
  }

  public setControllers(controllers: Resolver<Controller>[]) {
    this.container.register({
      controllers: registerAsArray(controllers),
    });

    return this;
  }

  public setSubscribers(subscribers: Resolver<EventSubscriber<any>>[]) {
    this.container.register({
      subscribers: registerAsArray(subscribers),
    });

    this.container.register({
      eventDispatcher: asClass(InMemoryEventDispatcher).singleton(),
    });

    return this;
  }

  public build() {
    return this.container;
  }
}
