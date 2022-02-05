import { PostDisslikedEvent } from '@core/post-management/manageable-post/events/post-dissliked.event';
import { PostRatingTypeValue } from '@core/shared-kernel/post-rating-type/post-rating-type.value-object';
import { TableNames } from '@infrastructure/table-names';
import { EventSubscriber, UniqueEntityID } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';

export class PostDisslikedSubscriber implements EventSubscriber<PostDisslikedEvent> {
  public readonly type = PostDisslikedEvent.name;

  public async handle(event: PostDisslikedEvent, unitOfWork: UnitOfWork): Promise<void> {
    const existingRating = await unitOfWork
      .getCurrentTransaction()
      .select('id')
      .where('post_id', event.payload.postId)
      .andWhere('account_id', event.payload.accountId)
      .from(TableNames.PostRating)
      .first();

    if (existingRating) {
      await unitOfWork
        .getCurrentTransaction()
        .update({
          rating_type: PostRatingTypeValue.Disslike,
        })
        .where('id', existingRating.id)
        .into(TableNames.PostRating);
    } else {
      await unitOfWork
        .getCurrentTransaction()
        .insert({
          id: new UniqueEntityID().value,
          post_id: event.payload.postId,
          account_id: event.payload.accountId,
          created_at: event.payload.disslikedAt,
          rating_type: PostRatingTypeValue.Disslike,
        })
        .into(TableNames.PostRating);
    }
  }
}
