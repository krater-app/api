import { AccountRepository } from '@core/account/account.repository';
import { CommandHandler, TokenProviderService, UnauthorizedError } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { AccessTokenPayloadDTO } from '@root/dtos/access-token-payload.dto';
import { RefreshTokenResponseDTO } from '@root/dtos/refresh-token.dto';
import { RefreshTokenCommand } from './refresh-token.command';

interface Dependencies {
  unitOfWork: UnitOfWork;
  tokenProviderService: TokenProviderService;
}

export class RefreshTokenCommandHandler
  implements CommandHandler<RefreshTokenCommand, RefreshTokenResponseDTO>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: RefreshTokenCommand): Promise<RefreshTokenResponseDTO> {
    const { tokenProviderService, unitOfWork } = this.dependencies;

    await unitOfWork.start();

    const repository = unitOfWork.getRepository<AccountRepository>('accountRepository');

    const refreshToken = command.payload.refreshToken.slice(7);

    return unitOfWork.complete(async () => {
      const tokenResponse = tokenProviderService.decodeToken<AccessTokenPayloadDTO>(refreshToken);

      if (!tokenResponse) {
        throw new UnauthorizedError();
      }

      const { accountId } = tokenResponse;

      if (!accountId) {
        throw new UnauthorizedError();
      }

      const account = await repository.findById(accountId);
      if (!account) {
        throw new UnauthorizedError();
      }

      tokenProviderService.verifyAndDecodeToken(
        refreshToken,
        `${process.env.JWT_SERVICE_SECRET}${account.getPassword()}`,
      );

      const accessToken = tokenProviderService.generateToken<AccessTokenPayloadDTO>(
        {
          accountId: account.getId(),
        },
        '30s',
      );

      return {
        accessToken: `Bearer ${accessToken}`,
      };
    });
  }
}
