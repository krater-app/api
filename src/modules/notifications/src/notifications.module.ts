import { asValue } from 'awilix';
import { ModuleBuilder, ModuleDependencies } from '@krater/building-blocks';
import { notificationsContainer } from './notifications.container';

export const notificationsModule = ({ logger, queryBuilder }: ModuleDependencies) => {
  const container = notificationsContainer();

  container.register({
    logger: asValue(logger),
    queryBuilder: asValue(queryBuilder),
  });

  return new ModuleBuilder().setName('notifications').setContainer(container).build();
};
