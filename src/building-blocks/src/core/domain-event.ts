export interface DomainEvent<PayloadType extends object = {}> {
  name: string;

  payload: PayloadType;
}
