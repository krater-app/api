import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { AccountRepository } from '@core/account/account.repository';
import { CommandHandler, TokenProviderService, UnauthorizedError } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { AccessTokenPayloadDTO } from '@root/dtos/access-token-payload.dto';
import { LoginCommand } from './login.command';

export interface LoginCommandHandlerResult {
  accessToken: string;
  refreshToken: string;
}

interface Dependencies {
  unitOfWork: UnitOfWork;
  passwordHashProviderService: PasswordHashProviderService;
  tokenProviderService: TokenProviderService;
}

export class LoginCommandHandler
  implements CommandHandler<LoginCommand, LoginCommandHandlerResult>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: LoginCommand): Promise<LoginCommandHandlerResult> {
    const { unitOfWork, passwordHashProviderService, tokenProviderService } = this.dependencies;

    await unitOfWork.start();

    const accountRepository = unitOfWork.getRepository<AccountRepository>('accountRepository');

    return unitOfWork.complete(async () => {
      const account = await accountRepository.findByNickname(command.payload.nickname);

      if (!account) {
        throw new UnauthorizedError();
      }

      await account.login(command.payload.password, passwordHashProviderService);

      const accessToken = tokenProviderService.generateToken<AccessTokenPayloadDTO>(
        {
          accountId: account.getId(),
        },
        '30s',
      );

      const refreshToken = tokenProviderService.generateToken<AccessTokenPayloadDTO>(
        {
          accountId: account.getId(),
        },
        '24h',
        `${process.env.JWT_SERVICE_SECRET}${account.getPassword()}`,
      );

      return {
        accessToken: `Bearer ${accessToken}`,
        refreshToken: `Bearer ${refreshToken}`,
      };
    });
  }
}
