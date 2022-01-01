import { Command } from '@krater/building-blocks';
import { ResendConfirmationEmailDTO } from '@root/dtos/resend-confirmation-email.dto';

export class ResendConfirmationEmailCommand implements Command<ResendConfirmationEmailDTO> {
  constructor(public readonly payload: ResendConfirmationEmailDTO) {}
}
