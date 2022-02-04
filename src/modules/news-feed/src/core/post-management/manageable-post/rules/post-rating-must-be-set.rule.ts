import { BusinessRule, UniqueEntityID } from '@krater/building-blocks';

export class PostRatingMustBeSetRule implements BusinessRule {
  public readonly message = 'To clear post rating, post must be liked or dissliked by you.';

  constructor(
    private readonly likedUserIDs: UniqueEntityID[],
    private readonly disslikedUserIDs: UniqueEntityID[],
    private readonly userId: UniqueEntityID,
  ) {}

  public isBroken() {
    return ![...this.likedUserIDs, ...this.disslikedUserIDs].some((ratingId) =>
      ratingId.equals(this.userId),
    );
  }
}
