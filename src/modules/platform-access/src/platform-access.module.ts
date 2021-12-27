import { ModuleBuilder } from '@krater/building-blocks';
import { platformAccessContainer } from './platform-access.container';

export const platformAccessModule = () => {
  const container = platformAccessContainer();

  return new ModuleBuilder().setName('platform-access').setContainer(container).build();
};
