import { UnauthorizedError } from '@errors/unauthorized.error';
import jwt from 'jsonwebtoken';
import { TokenProviderService } from './token-provider.service';

export class JwtTokenProviderService implements TokenProviderService {
  public generateToken<PayloadType extends object = {}>(
    payload: PayloadType,
    expiresIn = '1h',
  ): string {
    return jwt.sign(payload, process.env.JWT_SERVICE_SECRET, {
      expiresIn,
    });
  }

  public verifyAndDecodeToken<PayloadType extends object = {}>(token: string): PayloadType {
    try {
      const payload = jwt.verify(token, process.env.JWT_SERVICE_SECRET) as PayloadType;

      return payload;
    } catch {
      throw new UnauthorizedError();
    }
  }
}
