export interface AccountEmailCheckerService {
  isUnique(email: string): Promise<boolean>;
}
