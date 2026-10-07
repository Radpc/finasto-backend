import { toSqlTimezoneOffset } from './getPaymentValueSumsByPeriods';

describe('toSqlTimezoneOffset', () => {
  it.each([
    ['Z', '+00:00'],
    ['-03:00', '-03:00'],
    ['-03', '-03:00'],
    ['+0530', '+05:30'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(toSqlTimezoneOffset(input)).toBe(expected);
  });

  it.each(["+00:00') OR 1=1 --", 'America/Sao_Paulo', '+25:00', ''])(
    'rejects %p',
    (input) => {
      expect(() => toSqlTimezoneOffset(input)).toThrow();
    },
  );
});
