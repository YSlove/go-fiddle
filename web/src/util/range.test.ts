import * as range from './range';

describe('range.ts', () => {
  it('should return a single range', () => {
    const ranges: range.Range[] = [{start: 0, end: 10}];
    const result = range.mergeRanges(ranges);

    expect(result).toEqual([{start: 0, end: 10}]);
  });

  it('should merge nested ranges', () => {
    const ranges: range.Range[] = [{start: 0, end: 10}, {start: 5, end: 6}];
    const result = range.mergeRanges(ranges);

    expect(result).toEqual([{start: 0, end: 10}]);
  });

  it('should merge overlapping ranges', () => {
    const ranges: range.Range[] = [{start: 0, end: 10}, {start: 5, end: 20}];
    const result = range.mergeRanges(ranges);

    expect(result).toEqual([{start: 0, end: 20}]);
  });

  it('should not merge separate ranges', () => {
    const ranges: range.Range[] = [{start: 10, end: 20}, {start: 5, end: 6}];
    const result = range.mergeRanges(ranges);

    expect(result).toEqual([{start: 5, end: 6}, {start: 10, end: 20}]);
  });

  it('should merge adjacent ranges', () => {
    const ranges: range.Range[] = [{start: 7, end: 8}, {start: 5, end: 6}];
    const result = range.mergeRanges(ranges);

    expect(result).toEqual([{start: 5, end: 8}]);
  });
});
