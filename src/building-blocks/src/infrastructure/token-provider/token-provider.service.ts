export interface TokenProviderService {
  generateToken<PayloadType extends object = {}>(
    payload: PayloadType,
    expiresIn?: string,
    secret?: string,
  ): string;

  verifyAndDecodeToken<PayloadType extends object = {}>(
    token: string,
    secret?: string,
  ): PayloadType;

  decodeToken<PayloadType extends object = {}>(token: string): PayloadType;
}
