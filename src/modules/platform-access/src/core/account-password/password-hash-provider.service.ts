export interface PasswordHashProviderService {
  hashPassword(password: string): Promise<string>;

  isValidPassword(password: string, hashedPassword: string): Promise<boolean>;
}
