import { Command } from '@krater/building-blocks';
import { RefreshTokenDTO } from '@root/dtos/refresh-token.dto';

export class RefreshTokenCommand implements Command<RefreshTokenDTO> {
  constructor(public readonly payload: RefreshTokenDTO) {}
}
