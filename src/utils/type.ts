import { Operator, SortOrder } from "./enum";

export type Nullable = null | undefined;
export type BlankString = null | undefined | "";
export type NullableString = string | null | undefined;

export type NotEmptyArray<T> = [T, ...T[]];
export type EmptyArray = [];
export type NullableArray<T> = T[] | undefined | null;

export type BaseTreeData<T> = T & {
  children: BaseTreeData<T>[];
};

export type BaseTreeItem = {
  _idxs: number[];
  _level: number;
  _lastArray: number[];
  _isFather: boolean;
  _uniKey: string;
  _isLast?: boolean;
  _expanded?: boolean;
  children?: BaseTreeItem[];
  [key: string]: any;
};

export type TreeItem<T> = BaseTreeItem & T & { children: TreeItem<T>[] };

type BaseTreeOpinions<T> = {
  /**
   * maxLevel 需要展示tree的层级
   */
  maxLevel?: number;
  /**
   * keyField  充当唯一标识的字段
   */
  keyField: keyof T;
};

export type ListToTreeOps<T> = BaseTreeOpinions<T> & {
  /*
   * parentKeyField 充当parentKey的字段
   */
  parentKeyField: keyof T;
};

export type UpdateOperation<T> = {
  idxs: number[];
  field: keyof T;
  value: any;
};

export type Logic = "AND" | "OR";

export interface BaseCondition<T, V = unknown> {
  field: keyof T;
  operator: Operator;
  value?: string | number | (string | number)[];
  ignoreCase?: boolean;
  compare?: (itemValue: string | number, value: V) => boolean;
}

export interface ConditionGroup<T> {
  logic: Logic;
  conditions: Condition<T>[];
}

export type Condition<T> = BaseCondition<T> | ConditionGroup<T>;

export type QueryChunkOps<T> = {
  chunkSize?: number;
  isHdChild?: boolean;
  sourceChildField?: keyof T;
};

export type DynamicFields<Fields extends string[]> = {
  [K in Fields[number]]: string;
};

export enum ComparatorThan {
  LessThan = -1,
  Equal = 0,
  GreaterThan = 1,
}

// 多参数fn
export type Fn<T extends any[] = any[], K = void> = (...args: T) => K;

// 单参数fn
export type SingleFn<T = unknown, K = void> = Fn<[T], K>;

export type Compare<T> = Fn<[T, T], ComparatorThan>;

export type SortKey<T> =
  | keyof T
  | {
      key: keyof T;
      order?: SortOrder;
      transform?: (val: any) => any;
      skipIf?: (value: any) => boolean;
      compare?: Compare<any>;
    };

export type MergeSortOps<T> = {
  order?: SortOrder;
  sortKeys?: SortKey<T>[];
  compare?: Compare<T>;
  sortChild?: boolean;
  childField?: keyof T;
};
