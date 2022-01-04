import { v4 } from 'uuid';
import { DatabaseTransaction, QueryBuilder } from '..';
import { OutboxMessage, OutboxRepository, PersistedOutboxMessage } from './outbox.repository';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class KnexOutboxRepository implements OutboxRepository {
  public readonly name = 'outboxRepository';

  private currentTransaction: DatabaseTransaction | null = null;

  constructor(private readonly dependencies: Dependencies) {}

  public async insert(message: OutboxMessage): Promise<void> {
    await this.currentTransaction
      .insert({
        id: v4(),
        data: JSON.stringify(message.data),
        type: message.type,
        module: message.module,
        occured_on: new Date().toISOString(),
        processed_on: null,
      } as PersistedOutboxMessage)
      .into('krater.outbox_message');
  }

  public async findNotProcessedMessages(): Promise<(OutboxMessage & { id: string })[]> {
    const result = await this.dependencies.queryBuilder
      .select(['id', 'type', 'data', 'module'])
      .where('processed_on', null)
      .from('krater.outbox_message')
      .limit(20);

    return result.map((message) => ({
      ...message,
      data: JSON.parse(message.data),
    }));
  }

  public async processMessageById(id: string): Promise<void> {
    await this.dependencies.queryBuilder
      .update({
        processed_on: new Date().toISOString(),
      })
      .where('id', id)
      .into('krater.outbox_message');
  }

  public setCurrentTransaction(transaction: DatabaseTransaction): void {
    this.currentTransaction = transaction;
  }
}
