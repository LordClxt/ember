import { PAGINATION, paginationQuerySchema } from './pagination.contract.js';

describe('pagination contract', () => {
  it('applies defaults and coerces query strings', () => {
    expect(paginationQuerySchema.parse({})).toEqual({
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
    });
    expect(paginationQuerySchema.parse({ page: '2', limit: '5' })).toEqual({
      page: 2,
      limit: 5,
    });
  });

  it('rejects out-of-range values', () => {
    expect(paginationQuerySchema.safeParse({ page: '0' }).success).toBe(false);
    expect(
      paginationQuerySchema.safeParse({
        limit: String(PAGINATION.MAX_LIMIT + 1),
      }).success,
    ).toBe(false);
    expect(paginationQuerySchema.safeParse({ page: 'abc' }).success).toBe(
      false,
    );
  });
});
