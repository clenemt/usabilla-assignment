import { capitalize, sortByPredicate, getNextFromArray } from './funcs';

describe('capitalize()', () => {
  it('capitalizes the first letter of the string passed', () => {
    expect(capitalize('foo')).toEqual('Foo');
    expect(capitalize('foo bar')).toEqual('Foo bar');
    expect(capitalize('FooBar')).toEqual('FooBar');
  });
});

describe('sortByPredicate()', () => {
  it('returns a function', () => {
    expect(sortByPredicate()).toBeInstanceOf(Function);
  });

  it('sorts based on the property passed', () => {
    const tmp = [{ id: '2' }, { id: '1' }];
    expect(tmp.sort(sortByPredicate('id'))).toEqual([{ id: '1' }, { id: '2' }]);
  });
});

describe('getNextFromArray()', () => {
  it('returns the next item', () => {
    const tmp = [1, 2, 3, 4, 5];
    expect(getNextFromArray(tmp, 1)).toEqual(2);
  });

  it('loops to beginning', () => {
    const tmp = [1, 2, 3, 4, 5];
    expect(getNextFromArray(tmp, 5)).toEqual(1);
  });
});
