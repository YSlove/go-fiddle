export interface Range {
  start: number;
  end: number;
}

export function mergeRanges(ranges: Range[]): Range[] {
  const merged: Range[] = [];
  const sorted = ranges.sort((r1, r2) => {
    if (r1.start === r2.start) {
      if (r1.end === r2.end) {
        return 0;
      } else if (r1.end < r2.end) {
        return -1;
      } else {
        return 1;
      }
    } else if (r1.start < r2.start) {
      return -1;
    } else {
      return 1;
    }
  });

  let current: Range | null = null;
  for (const range of sorted) {
    const copy = { start: range.start, end: range.end };
    if (current === null) {
      current = copy;
      merged.push(copy);
      continue;
    }

    if (range.start <= current.end + 1 && range.end > current.end) {
      current.end = range.end
    } else if (range.start > current.end) {
      merged.push(copy);
    }

    current = merged[merged.length - 1];
  }

  return merged;
}
