import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { lastValueFrom, of } from 'rxjs';
import { EnvelopeInterceptor } from './envelope.interceptor';

const run = async (value: unknown, raw = false) => {
  const reflector = { getAllAndOverride: () => raw } as unknown as Reflector;
  const context = {
    getHandler: () => undefined,
    getClass: () => undefined,
  } as unknown as ExecutionContext;
  const next: CallHandler = { handle: () => of(value) };
  return lastValueFrom(
    new EnvelopeInterceptor(reflector).intercept(context, next),
  );
};

describe('EnvelopeInterceptor', () => {
  it('wraps what the controller returns as { data }', async () => {
    expect(await run({ id: '1' })).toEqual({ data: { id: '1' } });
    expect(await run([1, 2])).toEqual({ data: [1, 2] });
  });

  it('sends { data: null } when the controller returns nothing', async () => {
    expect(await run(undefined)).toEqual({ data: null });
  });

  it('leaves @RawResponse() handlers alone', async () => {
    expect(await run({ status: 'ok' }, true)).toEqual({ status: 'ok' });
  });
});
