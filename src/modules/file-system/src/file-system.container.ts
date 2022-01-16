import { asClass } from 'awilix';
import { ContainerBuilder } from '@krater/building-blocks';
import { KnexUnitOfWork } from '@krater/database';
import { FileRepositoryImpl } from '@infrastructure/file/file.repository';
import { UploadNewFileCommandHandler } from '@app/commands/upload-new-file/upload-new-file.command-handler';
import { FileSystemController } from '@api/file-system.controller';

export const fileSystemContainer = () =>
  new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([asClass(UploadNewFileCommandHandler).singleton()])
    .setControllers([asClass(FileSystemController).singleton()])
    .setQueryHandlers([])
    .setRepositories([asClass(FileRepositoryImpl).singleton()])
    .setSubscribers([])
    .setCustom({
      unitOfWork: asClass(KnexUnitOfWork).singleton(),
    })
    .build();
