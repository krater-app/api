import { PostStatus } from '@core/shared-kernel/post-status/post-status.value-object';
import { NewPostCreatedEvent } from '@krater/integration-events';
import { TextPost } from './text-post.aggregate-root';

describe('[DOMAIN] News Feed ==> Text Post', () => {
  test('should throw an error if content is invalid', () => {
    expect(() =>
      TextPost.createNew({
        authorId: '#author-id',
        content: '#content',
        isNsfw: false,
        tags: [],
        title: '#title',
      }),
    ).toThrowError('Provided content is not valid. Provide at least 10 characters.');
  });

  test('should throw an error if title is invalid', () => {
    expect(() =>
      TextPost.createNew({
        authorId: '#author-id',
        content: '#large-content',
        isNsfw: false,
        tags: [],
        title: '#',
      }),
    ).toThrowError('Provided title is not valid. Provide at least 3 characters.');
  });

  test('should throw an error if there is more than allowed number of tags', () => {
    expect(() =>
      TextPost.createNew({
        authorId: '#author-id',
        content: '#large-content',
        isNsfw: false,
        tags: [
          'tag-1',
          'tag-2',
          'tag-3',
          'tag-4',
          'tag-5',
          'tag-6',
          'tag-7',
          'tag-8',
          'tag-9',
          'tag-10',
          'tag-11',
        ],
        title: '#',
      }),
    ).toThrowError("Post can't contain more than 10 tags.");
  });

  test('should check only unique tags', () => {
    expect(() =>
      TextPost.createNew({
        authorId: '#author-id',
        content: '#large-content',
        isNsfw: false,
        tags: [
          'tag-1',
          'tag-2',
          'tag-3',
          'tag-4',
          'tag-5',
          'tag-6',
          'tag-7',
          'tag-8',
          'tag-9',
          'tag-10',
          'tag-1',
        ],
        title: '#title',
      }),
    ).not.toThrowError();
  });

  test('should throw an error if tag have invalid name', () => {
    expect(() =>
      TextPost.createNew({
        authorId: '#author-id',
        content: '#large-content',
        isNsfw: false,
        tags: ['tag-1', 'tag-2', '3'],
        title: '#title',
      }),
    ).toThrowError('Tag name must contain at least 3 characters.');
  });

  test('should create text post and dispatch proper domain event', () => {
    const textPost = TextPost.createNew({
      authorId: '#author-id',
      content: '#large-content',
      isNsfw: false,
      tags: ['tag-1', 'tag-2', 'tag-3'],
      title: '#title',
    });

    expect(textPost.getDomainEvents()[0] instanceof NewPostCreatedEvent).toBeTruthy();
    expect(textPost.getStatus().equals(PostStatus.Draft)).toBeTruthy();
  });
});
