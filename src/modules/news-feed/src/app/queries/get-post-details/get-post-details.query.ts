import { Query } from '@krater/building-blocks';
import { GetPostDetailsDTO } from '@root/dtos/get-post-details.dto';

export class GetPostDetailsQuery implements Query<GetPostDetailsDTO> {
  constructor(public readonly payload: GetPostDetailsDTO) {}
}
