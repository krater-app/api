export interface AccountNicknameCheckerService {
  isUnique(nickname: string): Promise<boolean>;
}
