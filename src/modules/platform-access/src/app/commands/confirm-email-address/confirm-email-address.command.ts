import { Command } from '@krater/building-blocks';
import { ConfirmEmailAddressDTO } from '@root/dtos/confirm-email-address.dto';

export class ConfirmEmailAddressCommand implements Command<ConfirmEmailAddressDTO> {
  constructor(public readonly payload: ConfirmEmailAddressDTO) {}
}
