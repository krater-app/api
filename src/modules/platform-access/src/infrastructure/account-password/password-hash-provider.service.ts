import bcrypt from 'bcrypt';
import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';

export class BcryptPasswordHashProviderService implements PasswordHashProviderService {
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async isValidPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
