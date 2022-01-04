/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { AppModule, CronJob } from '@krater/building-blocks';
import { OutboxRepository } from '@krater/database';

interface Dependencies {
  outboxRepository: OutboxRepository;
  modules: AppModule[];
}

export class ProcessOutboxJob extends CronJob {
  constructor(private readonly dependencies: Dependencies) {
    super('*/15 * * * * *');
  }

  protected async handle(): Promise<void> {
    const { outboxRepository, modules } = this.dependencies;

    const outboxMessages = await outboxRepository.findNotProcessedMessages();

    for (const message of outboxMessages) {
      const promises = modules
        .filter((module) => module.name !== message.module)
        .map((module) =>
          module.dispatchEvent({
            name: message.type,
            payload: message.data,
            module: message.module,
          }),
        );

      await outboxRepository.processMessageById(message.id);

      await Promise.all(promises);
    }
  }
}
