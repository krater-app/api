import { EmailVerificationCodeStatus } from '@core/email-verification-code-status/email-verification-code-status.value-object';
import { Entity, UniqueEntityID } from '@krater/building-blocks';
import { EmailVerificationCodeProviderService } from './email-verification-code-provider.service';

interface EmailVerificationCodeProps {
  code: string;
  status: EmailVerificationCodeStatus;
  generatedAt: Date;
}

export interface PersistedEmailVerificationCode {
  id: string;
  code: string;
  status: string;
  generatedAt: string;
}

export class EmailVerificationCode extends Entity<EmailVerificationCodeProps> {
  private constructor(props: EmailVerificationCodeProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew(
    emailVerificationCodeProviderService: EmailVerificationCodeProviderService,
  ) {
    return new EmailVerificationCode({
      code: emailVerificationCodeProviderService.generateVerificationCode(6),
      generatedAt: new Date(),
      status: EmailVerificationCodeStatus.Active,
    });
  }

  public static fromPersistence({ id, code, generatedAt, status }: PersistedEmailVerificationCode) {
    return new EmailVerificationCode(
      {
        code,
        generatedAt: new Date(generatedAt),
        status: EmailVerificationCodeStatus.fromValue(status),
      },
      new UniqueEntityID(id),
    );
  }

  public getId() {
    return this.id.value;
  }

  public confirm() {
    this.props.status = EmailVerificationCodeStatus.Used;
  }

  public archive() {
    this.props.status = EmailVerificationCodeStatus.Archvied;
  }

  public getCode() {
    return this.props.code;
  }

  public getGeneratedAt() {
    return this.props.generatedAt;
  }

  public getStatus() {
    return this.props.status;
  }
}
