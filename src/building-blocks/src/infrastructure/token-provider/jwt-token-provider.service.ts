import { UnauthorizedError } from '@errors/unauthorized.error';
import jwt from 'jsonwebtoken';
import { TokenProviderService } from './token-provider.service';

export class JwtTokenProviderService implements TokenProviderService {
  public generateToken<PayloadType extends object = {}>(
    payload: PayloadType,
    expiresIn = '1h',
    secret = process.env.JWT_SERVICE_SECRET,
  ): string {
    return jwt.sign(payload, secret, {
      expiresIn,
    });
  }

  public verifyAndDecodeToken<PayloadType extends object = {}>(
    token: string,
    secret = process.env.JWT_SERVICE_SECRET,
  ): PayloadType {
    try {
      const payload = jwt.verify(token, secret) as PayloadType;

      return payload;
    } catch {
      throw new UnauthorizedError();
    }
  }

  public decodeToken<PayloadType extends object = {}>(token: string): PayloadType {
    const payload = jwt.decode(token) as PayloadType;

    return payload;
  }
}
