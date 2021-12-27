export interface TokenProviderService {
  generateToken<PayloadType extends object = {}>(payload: PayloadType, expiresIn?: string): string;

  verifyAndDecodeToken<PayloadType extends object = {}>(token: string): PayloadType;
}
