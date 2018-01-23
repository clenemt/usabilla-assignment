import feedbacksService from './feedbacksService';

describe('get()', () => {
  it('returns a Promise', () => {
    expect(feedbacksService.get()).toBeInstanceOf(Promise);
  });
});
