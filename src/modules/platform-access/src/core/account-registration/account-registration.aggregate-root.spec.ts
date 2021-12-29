import { AccountEmailCheckerService } from '@core/account-email/account-email-checker.service';
import { AccountNicknameCheckerService } from '@core/account-nickname/account-nickname-checker.service';
import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { AccountStatusValue } from '@core/account-status/account-status.value-object';
import { createMockProxy } from '@krater/building-blocks';
import { AccountRegistration } from './account-registration.aggregate-root';
import { AccountEmailConfirmedEvent } from './events/account-email-confirmed.event';
import { NewAccountRegisteredEvent } from './events/new-account-registered.event';

describe('[DOMAIN] Platform Access ==> Account Registration', () => {
  const accountEmailCheckerService = createMockProxy<AccountEmailCheckerService>();
  const accountNicknameCheckerService = createMockProxy<AccountNicknameCheckerService>();
  const passwordHashProviderService = createMockProxy<PasswordHashProviderService>();

  beforeEach(() => {
    accountEmailCheckerService.mockClear();
    accountNicknameCheckerService.mockClear();
    passwordHashProviderService.mockClear();
  });

  describe('Account Email', () => {
    test('should throw an error if email has invalid format.', async () => {
      await expect(() =>
        AccountRegistration.registerNew(
          {
            email: '#invalid-email',
            nickname: '#nickname',
            password: '#password',
          },
          {
            accountEmailCheckerService,
            accountNicknameCheckerService,
            passwordHashProviderService,
          },
        ),
      ).rejects.toThrowError('Provided email have invalid format.');
    });

    test('should throw an error if email is not unique.', async () => {
      accountEmailCheckerService.isUnique.mockResolvedValue(false);

      await expect(() =>
        AccountRegistration.registerNew(
          {
            email: 'email@gmail.com',
            nickname: '#nickname',
            password: '#password',
          },
          {
            accountEmailCheckerService,
            accountNicknameCheckerService,
            passwordHashProviderService,
          },
        ),
      ).rejects.toThrowError('Provided email is already taken.');
    });
  });

  describe('Account Nickname', () => {
    test('should throw an error if nickname has invalid format.', async () => {
      accountEmailCheckerService.isUnique.mockResolvedValue(true);

      await expect(() =>
        AccountRegistration.registerNew(
          {
            email: 'email@gmail.com',
            nickname: '#',
            password: '#password',
          },
          {
            accountEmailCheckerService,
            accountNicknameCheckerService,
            passwordHashProviderService,
          },
        ),
      ).rejects.toThrowError(
        'Provided nickname have invalid format. Provide at least 3 characters.',
      );
    });

    test('should throw an error if nickname is not unique.', async () => {
      accountEmailCheckerService.isUnique.mockResolvedValue(true);
      accountNicknameCheckerService.isUnique.mockResolvedValue(false);

      await expect(() =>
        AccountRegistration.registerNew(
          {
            email: 'email@gmail.com',
            nickname: '#nickname',
            password: '#password',
          },
          {
            accountEmailCheckerService,
            accountNicknameCheckerService,
            passwordHashProviderService,
          },
        ),
      ).rejects.toThrowError('Provided nickname is already taken. Please use different one.');
    });
  });

  describe('Account Password', () => {
    test('should throw an error if password does not have at least 6 characters.', async () => {
      accountEmailCheckerService.isUnique.mockResolvedValue(true);
      accountNicknameCheckerService.isUnique.mockResolvedValue(true);

      await expect(() =>
        AccountRegistration.registerNew(
          {
            email: 'email@gmail.com',
            nickname: '#nickname',
            password: 'pass',
          },
          {
            accountEmailCheckerService,
            accountNicknameCheckerService,
            passwordHashProviderService,
          },
        ),
      ).rejects.toThrowError(
        'Provided password is not strong enough. Provide at least 6 characters.',
      );
    });

    test('should throw an error if password does not have at least one digit.', async () => {
      accountEmailCheckerService.isUnique.mockResolvedValue(true);
      accountNicknameCheckerService.isUnique.mockResolvedValue(true);

      await expect(() =>
        AccountRegistration.registerNew(
          {
            email: 'email@gmail.com',
            nickname: '#nickname',
            password: '#password',
          },
          {
            accountEmailCheckerService,
            accountNicknameCheckerService,
            passwordHashProviderService,
          },
        ),
      ).rejects.toThrowError(
        'Provided password is not strong enough. Provide password with minimum one digit.',
      );
    });

    test('should throw an error if password has more than 50 characters.', async () => {
      accountEmailCheckerService.isUnique.mockResolvedValue(true);
      accountNicknameCheckerService.isUnique.mockResolvedValue(true);

      await expect(() =>
        AccountRegistration.registerNew(
          {
            email: 'email@gmail.com',
            nickname: '#nickname',
            password: Array(51).fill('1').join(''),
          },
          {
            accountEmailCheckerService,
            accountNicknameCheckerService,
            passwordHashProviderService,
          },
        ),
      ).rejects.toThrowError('Invalid password. Password can contain max of 50 characters.');
    });
  });

  test('should create account and dispatch proper domain event.', async () => {
    accountEmailCheckerService.isUnique.mockResolvedValue(true);
    accountNicknameCheckerService.isUnique.mockResolvedValue(true);
    passwordHashProviderService.hashPassword.mockResolvedValue('#hashed-password');

    const accountRegistration = await AccountRegistration.registerNew(
      {
        email: 'account@email.com',
        nickname: '#nickname',
        password: 'test123',
      },
      {
        accountEmailCheckerService,
        accountNicknameCheckerService,
        passwordHashProviderService,
      },
    );

    expect(accountRegistration.getEmail()).toEqual('account@email.com');
    expect(accountRegistration.getPasswordHash()).toEqual('#hashed-password');
    expect(accountRegistration.getStatus()).toEqual(AccountStatusValue.WaitingForEmailConfirmation);
    expect(
      accountRegistration.getDomainEvents()[0] instanceof NewAccountRegisteredEvent,
    ).toBeTruthy();
  });

  describe('Email confirmation', () => {
    test('should throw an error if email is already confirmed.', async () => {
      const accountRegistration = AccountRegistration.fromPersistence({
        id: '#id',
        email: '#email',
        emailConfirmedAt: new Date().toISOString(),
        nickname: '#nickname',
        passwordHash: '#password-hash',
        registeredAt: new Date().toISOString(),
        status: AccountStatusValue.EmailConfirmed,
      });

      expect(() => accountRegistration.confirmEmail()).toThrowError('Email is already confirmed.');
    });

    test('should confirm email and dispatch proper event.', async () => {
      const accountRegistration = AccountRegistration.fromPersistence({
        id: '#id',
        email: '#email',
        emailConfirmedAt: null,
        nickname: '#nickname',
        passwordHash: '#password-hash',
        registeredAt: new Date().toISOString(),
        status: AccountStatusValue.WaitingForEmailConfirmation,
      });

      accountRegistration.confirmEmail();

      expect(accountRegistration.getStatus()).toEqual(AccountStatusValue.EmailConfirmed);
      expect(accountRegistration.getEmailConfirmedAt()).not.toEqual(null);
      expect(
        accountRegistration.getDomainEvents()[0] instanceof AccountEmailConfirmedEvent,
      ).toBeTruthy();
    });
  });
});
