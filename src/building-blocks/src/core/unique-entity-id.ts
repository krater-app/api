import { Identifier } from '@core/identifier';
import { v4 } from 'uuid';

export class UniqueEntityID extends Identifier<string> {
  constructor(id?: string) {
    super(id || v4());
  }
}
