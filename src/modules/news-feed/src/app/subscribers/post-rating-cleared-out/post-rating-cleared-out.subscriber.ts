import { PostRatingClearedOutEvent } from '@core/post-management/manageable-post/events/post-rating-cleared-out.event';
import { PostRatingTypeValue } from '@core/shared-kernel/post-rating-type/post-rating-type.value-object';
import { TableNames } from '@infrastructure/table-names';
import { EventSubscriber } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';

export class PostRatingClearedOutSubscriber implements EventSubscriber<PostRatingClearedOutEvent> {
  public readonly type = PostRatingClearedOutEvent.name;

  public async handle(event: PostRatingClearedOutEvent, unitOfWork: UnitOfWork): Promise<void> {
    const existingRating = await unitOfWork
      .getCurrentTransaction()
      .select('id')
      .where('post_id', event.payload.postId)
      .andWhere('account_id', event.payload.accountId)
      .from(TableNames.PostRating)
      .first();

    if (!existingRating) {
      return;
    }

    await unitOfWork
      .getCurrentTransaction()
      .update({
        rating_type: PostRatingTypeValue.Neutral,
      })
      .where('id', existingRating.id)
      .into(TableNames.PostRating);
  }
}
