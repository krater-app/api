export interface SendMailPayload {
  from?: string;
  to: string;
  subject: string;
  payload: object;
  template: string;
}


export interface MailerService {
    sendMail(payload: SendMailPayload): Promise<void>;
}