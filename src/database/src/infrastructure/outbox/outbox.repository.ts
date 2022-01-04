import { UnitOfWorkRepository } from '..';

export interface PersistedOutboxMessage {
  id: string;
  occured_on: string;
  type: string;
  module: string;
  data: string;
  processed_on: string | null;
}

export interface OutboxMessage {
  type: string;
  module: string;
  data: object;
}

export interface OutboxRepository extends UnitOfWorkRepository {
  insert(message: OutboxMessage): Promise<void>;

  findNotProcessedMessages(): Promise<(OutboxMessage & { id: string })[]>;

  processMessageById(id: string): Promise<void>;
}
