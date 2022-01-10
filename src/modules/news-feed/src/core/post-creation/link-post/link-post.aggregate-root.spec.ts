import { NewPostCreatedEvent } from '@krater/integration-events';
import { LinkPost } from './link-post.aggregate-root';

describe('[DOMAIN] News Feed ==> Link Post', () => {
  test('should throw an error if description is invalid', () => {
    expect(() =>
      LinkPost.createNew({
        authorId: '#author-id',
        description: '#invalid',
        customImagePath: null,
        isNsfw: false,
        link: 'https://google.com',
        tags: [],
        title: '#title',
      }),
    ).toThrowError(
      'Provided link post description is invalid. Please, use at least 10 words and maximum of 300 words.',
    );
  });

  test('should throw an error if description has more than 300 words', () => {
    expect(() =>
      LinkPost.createNew({
        authorId: '#author-id',
        description: Array(301).fill('word').join(' '),
        customImagePath: null,
        isNsfw: false,
        link: 'https://google.com',
        tags: [],
        title: '#title',
      }),
    ).toThrowError(
      'Provided link post description is invalid. Please, use at least 10 words and maximum of 300 words.',
    );
  });

  test('should throw an error if link is invalid', () => {
    expect(() =>
      LinkPost.createNew({
        authorId: '#author-id',
        description: '#valid description',
        customImagePath: null,
        isNsfw: false,
        link: '#link',
        tags: [],
        title: '#title',
      }),
    ).toThrowError('Provided link is in invalid format.');
  });

  test('should throw an error if there is more than 10 tags', () => {
    expect(() =>
      LinkPost.createNew({
        authorId: '#author-id',
        description: '#valid description',
        customImagePath: null,
        isNsfw: false,
        link: 'https://google.com',
        tags: [
          '#tag-1',
          '#tag-2',
          '#tag-3',
          '#tag-4',
          '#tag-5',
          '#tag-6',
          '#tag-7',
          '#tag-8',
          '#tag-9',
          '#tag-10',
          '#tag-11',
        ],
        title: '#title',
      }),
    ).toThrowError("Post can't contain more than 10 tags.");
  });

  test('should ignore not unique tags', () => {
    expect(() =>
      LinkPost.createNew({
        authorId: '#author-id',
        description: '#valid description',
        customImagePath: null,
        isNsfw: false,
        link: 'https://google.com',
        tags: [
          '#tag-1',
          '#tag-2',
          '#tag-3',
          '#tag-4',
          '#tag-5',
          '#tag-6',
          '#tag-7',
          '#tag-8',
          '#tag-9',
          '#tag-10',
          '#tag-1',
        ],
        title: '#title',
      }),
    ).not.toThrowError();
  });

  test('should throw an error if title is invalid', () => {
    expect(() =>
      LinkPost.createNew({
        authorId: '#author-id',
        description: '#valid description',
        customImagePath: null,
        isNsfw: false,
        link: 'https://google.com',
        tags: [
          '#tag-1',
          '#tag-2',
          '#tag-3',
          '#tag-4',
          '#tag-5',
          '#tag-6',
          '#tag-7',
          '#tag-8',
          '#tag-9',
          '#tag-10',
          '#tag-1',
        ],
        title: '#',
      }),
    ).toThrowError('Provided title is not valid. Provide at least 3 characters.');
  });

  test('should create new link post and dispatch proper domain event', () => {
    expect(() =>
      LinkPost.createNew({
        authorId: '#author-id',
        description: '#valid description',
        customImagePath: null,
        isNsfw: false,
        link: 'https://google.com',
        tags: [
          '#tag-1',
          '#tag-2',
          '#tag-3',
          '#tag-4',
          '#tag-5',
          '#tag-6',
          '#tag-7',
          '#tag-8',
          '#tag-9',
          '#tag-10',
          '#tag-1',
        ],
        title: '#',
      }),
    ).toThrowError('Provided title is not valid. Provide at least 3 characters.');
  });

  test('should create link post and dispatch proper domain event', () => {
    const linkPost = LinkPost.createNew({
      authorId: '#author-id',
      description: '#valid description',
      customImagePath: null,
      isNsfw: false,
      link: 'https://google.com',
      tags: [
        '#tag-1',
        '#tag-2',
        '#tag-3',
        '#tag-4',
        '#tag-5',
        '#tag-6',
        '#tag-7',
        '#tag-8',
        '#tag-9',
        '#tag-10',
        '#tag-1',
      ],
      title: '#title',
    });

    expect(linkPost.getDomainEvents()[0] instanceof NewPostCreatedEvent).toBeTruthy();
  });
});
