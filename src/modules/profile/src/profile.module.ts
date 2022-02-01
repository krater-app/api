import { ModuleBuilder, ModuleDependencies } from '@krater/building-blocks';
import { asValue } from 'awilix';
import { profileContainer } from './profile.container';

export const profileModule = ({
  authMiddleware,
  logger,
  isAccountConfirmedMiddleware,
  queryBuilder,
  storageService,
}: ModuleDependencies) => {
  const container = profileContainer();

  container.register({
    authMiddleware: asValue(authMiddleware),
    logger: asValue(logger),
    isAccountConfirmedMiddleware: asValue(isAccountConfirmedMiddleware),
    queryBuilder: asValue(queryBuilder),
    storageService: asValue(storageService),
  });

  return new ModuleBuilder().setName('profile').setContainer(container).build();
};
