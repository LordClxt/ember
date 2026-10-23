import {
  ITEM_NAME_MAX_LENGTH,
  createItemSchema,
  itemSchema,
  updateItemSchema,
} from './item.contract.js';

describe('item contract', () => {
  it('trims the name and rejects blank or too long names', () => {
    expect(createItemSchema.parse({ name: '  Ember  ' })).toEqual({ name: 'Ember' });
    expect(createItemSchema.safeParse({ name: '   ' }).success).toBe(false);
    expect(
      createItemSchema.safeParse({ name: 'x'.repeat(ITEM_NAME_MAX_LENGTH + 1) }).success,
    ).toBe(false);
  });

  it('rejects unknown fields', () => {
    expect(createItemSchema.safeParse({ name: 'a', unknown: true }).success).toBe(false);
  });

  it('allows partial updates and clearing the description, not a null name', () => {
    expect(updateItemSchema.parse({ description: null })).toEqual({ description: null });
    expect(updateItemSchema.parse({})).toEqual({});
    expect(updateItemSchema.safeParse({ name: null }).success).toBe(false);
  });

  it('describes the JSON returned by the API', () => {
    const item = {
      id: '0199d6b2-7d3e-7cc2-9a5e-0d3c4f6a8b10',
      name: 'Ember',
      description: null,
      createdAt: '2026-10-23T07:00:00.000Z',
      updatedAt: '2026-10-23T07:00:00.000Z',
    };
    expect(itemSchema.parse(item)).toEqual(item);
  });
});
