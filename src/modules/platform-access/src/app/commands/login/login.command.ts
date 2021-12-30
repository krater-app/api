import { Command } from '@krater/building-blocks';
import { LoginDTO } from '@root/dtos/login.dto';

export class LoginCommand implements Command<LoginDTO> {
  constructor(public readonly payload: LoginDTO) {}
}
