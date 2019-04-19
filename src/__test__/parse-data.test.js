import parse, { parseData } from '../parse-data';

describe('parse-data.js', () => {
  it('should be parse-data status and type', () => {
    expect(parseData('hello world')).toEqual([{ state: 'normal', value: 'hello world', children: [], type: 'node' }]);
    expect(parseData('*hello world')).toEqual([{ state: 'active', value: 'hello world', children: [], type: 'node' }]);
    expect(parseData('-hello world')).toEqual([{ state: 'disabled', value: 'hello world', children: [], type: 'node' }]);
    expect(parseData('~hello world')).toEqual([{ state: 'hover', value: 'hello world', children: [], type: 'node' }]);

    expect(parseData('#hello world')).toEqual([{ state: 'normal', value: 'hello world', children: [], type: 'comment' }]);
    expect(parseData('---')).toEqual([{ state: 'normal', value: '--', children: [], type: 'divider' }]);
  });

  it('should be parse-data content', () => {
    expect(parseData('hello world', { parseContent: true })).toEqual([{ state: 'normal', value: [{ type: 'text', value: 'hello world'}], children: [], type: 'node' }]);
    expect(parseData('[icon]hello world', { parseContent: true })).toEqual([{ state: 'normal', value: [{type: 'icon', value: 'icon'}, { type: 'text', value: 'hello world'}], children: [], type: 'node' }]);
    expect(parseData('hello world[icon]', { parseContent: true })).toEqual([{ state: 'normal', value: [{ type: 'text', value: 'hello world'}, {type: 'icon', value: 'icon'}], children: [], type: 'node' }]);
    expect(parseData('hello[icon]world', { parseContent: true })).toEqual([{ state: 'normal', value: [{ type: 'text', value: 'hello'}, {type: 'icon', value: 'icon'}, {type: 'text', value: 'world'}], children: [], type: 'node' }]);
  });

  it('should be parse-data content', () => {
    expect(parseData('hello world\nhello world')).toEqual([{ state: 'normal', value: 'hello world', children: [], type: 'node' }, { state: 'normal', value: 'hello world', children: [], type: 'node' }]);
    expect(parseData('hello world\n\thello world')).toEqual([{ state: 'normal', value: 'hello world', children: [{ state: 'normal', value: 'hello world', children: [], type: 'node' }], type: 'node' }]);
  });
});
