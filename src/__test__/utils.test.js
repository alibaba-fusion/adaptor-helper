import { firstUpperCase, toLabelWord } from '../utils';

describe('utils', () => {
  it('should be firstUpperCase', () => {
    expect(firstUpperCase('abc')).toBe('Abc');
    expect(firstUpperCase()).toBe('');
  });

  it('should be toLabelWord', () => {
    expect(toLabelWord('helloWorld')).toBe('Hello World');
    expect(toLabelWord('hello-World')).toBe('Hello World');
  });
});
