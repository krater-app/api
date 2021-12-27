import { Command } from '@krater/building-blocks';
import { RegisterNewAccountDTO } from '@root/dtos/register-new-account.dto';

export class RegisterNewAccountCommand implements Command<RegisterNewAccountDTO> {
  constructor(public readonly payload: RegisterNewAccountDTO) {}
}
