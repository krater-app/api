import { Command } from '@krater/building-blocks';

interface Payload {
  accountId: string;
  postId: string;
}

export class DisslikePostCommand implements Command<Payload> {
  constructor(public readonly payload: Payload) {}
}
