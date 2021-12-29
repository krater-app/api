import { CronJob, Logger } from '@krater/building-blocks';
import { Application } from 'express';
import { createAppContainer } from './container';

(async () => {
  const container = await createAppContainer();

  const app = container.resolve<Application>('app');
  const logger = container.resolve<Logger>('logger');

  const jobs = container.resolve<CronJob[]>('jobs');

  jobs.forEach((job) => job.setupJob());

  app.listen(4000, () => logger.info('Server listening on http://localhost:4000'));
})();
