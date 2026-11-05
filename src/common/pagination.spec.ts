import { pageArgs, toPage } from './pagination';

describe('pagination', () => {
  it('turns a page query into skip and take', () => {
    expect(pageArgs({ page: 1, pageSize: 20 })).toEqual({ skip: 0, take: 20 });
    expect(pageArgs({ page: 3, pageSize: 10 })).toEqual({ skip: 20, take: 10 });
  });

  it('builds the list body with page, pageSize and total', () => {
    expect(toPage(['a'], 41, { page: 3, pageSize: 20 })).toEqual({
      items: ['a'],
      pagination: { page: 3, pageSize: 20, total: 41 },
    });
  });
});
