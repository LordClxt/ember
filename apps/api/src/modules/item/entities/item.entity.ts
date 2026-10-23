import type { Item as ItemContract } from '@ember/contracts';
import type { BaseEntity } from '../../../common/types/base-entity.type.js';
import type {
  AssertTrue,
  SerializedAs,
} from '../../../common/types/serialized.type.js';

/** Persisted item. Its JSON is the `Item` contract (dates become ISO strings). */
export interface Item extends BaseEntity {
  name: string;
  description: string | null;
}

/** Fails to compile if the JSON of `Item` drifts from the shared contract. */
export type ItemMatchesContract = AssertTrue<SerializedAs<Item, ItemContract>>;
