import feedbacksService from './feedbacksService';

jest.mock('axios');

describe('get()', () => {
  it('returns a Promise', () => {
    expect(feedbacksService.get()).toBeInstanceOf(Promise);
  });

  it('returns the feedback items', () => {
    const feedback = { id: '1', comment: 'foo' };
    expect(feedbacksService.get()).resolves.toContainEqual(feedback);
    return expect(feedbacksService.get()).resolves.toHaveLength(2);
  });
});
