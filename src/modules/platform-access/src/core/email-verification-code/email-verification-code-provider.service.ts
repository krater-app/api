export interface EmailVerificationCodeProviderService {
  generateVerificationCode(length?: number): string;
}
