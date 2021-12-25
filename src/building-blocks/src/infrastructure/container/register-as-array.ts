import { AwilixContainer, Resolver } from 'awilix';

export const registerAsArray = <Type>(resolvers: Resolver<Type>[]): Resolver<Type[]> => {
  return {
    resolve: (container: AwilixContainer) => resolvers.map((resolver) => container.build(resolver)),
  };
};
