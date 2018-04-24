import * as regex from './regex';

describe('regex.ts', () => {
  describe('escape', () => {
    it('should escape `.` character', () => {
      const result = regex.escape`${'.'}`;

      expect(result).toBe('\\.');
    });

    it('should escape `*` character', () => {
      const result = regex.escape`${'*'}`;

      expect(result).toBe('\\*');
    });

    it('should escape `.?` characters', () => {
      const result = regex.escape`${'.?'}`;

      expect(result).toBe('\\.\\?');
    });

    it('should escape `.?` characters in another expression', () => {
      const result = regex.escape`^${'.?'}$`;

      expect(result).toBe('^\\.\\?$');
    });
  });

  describe('escape with wildcards', () => {
    it('should escape `.` character', () => {
      const result = regex.escapeWildcard`${'.'}`;

      expect(result).toBe('\\.');
    });

    it('should escape wildcard character', () => {
      const result = regex.escapeWildcard`${'*'}`;

      expect(result).toBe('[^/]+');
    });

    it('should escape wildcard with other characters', () => {
      const result = regex.escapeWildcard`${'*.com'}`;

      expect(result).toBe('[^/]+\\.com');
    });
  });
});
