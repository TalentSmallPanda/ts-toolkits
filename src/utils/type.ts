import { ChildQueryMode, Operator, SortOrder } from "./enum";

export type Nullable = null | undefined;
export type BlankString = null | undefined | "";
export type NullableString = string | null | undefined;

export type NotEmptyArray<T> = [T, ...T[]];
export type EmptyArray = [];
export type NullableArray<T> = T[] | undefined | null;

export type BaseTreeData<T> = T & {
  children: BaseTreeData<T>[];
  _d: number;
};

export type BaseTreeItem = {
  _idxs: number[];
  _level: number;
  _lastArray: number[];
  _isFather: boolean;
  _uniKey: string;
  _isLast?: boolean;
  _expanded?: boolean;
  _visible?: string;
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
  compare?: (itemValue: string | number, value: V, item: T) => boolean;
}

export interface ConditionGroup<T> {
  logic: Logic;
  conditions: Condition<T>[];
}

export type Condition<T> = BaseCondition<T> | ConditionGroup<T>;

export type QueryChunkOps<T> = {
  chunkSize?: number; // 分块大小
  isHdChild?: boolean; // 是否处理子项
  sourceChildField?: keyof T | ((item: T) => keyof T); // 子项字段名或动态字段函数
  childQueryMode?: ChildQueryMode; // 子项查询模式
  onItemMatch?: (params: { item: T; isMatch: boolean; isMatchChild: boolean; childList: T[] }) => boolean; // 回调函数，决定是否保留父项
};

export type Primitive = string | number | boolean;

type FieldObject = Record<string, Primitive>;

export type FieldItem = string | FieldObject;

type InferField<T> = T extends string
  ? { [K in T]: string }
  : T extends object
  ? { [K in keyof T]: T[K] extends Primitive ? T[K] : never }
  : never;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type FlattenIntersection<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

export type MergeFields<T> = T extends any[]
  ? FlattenIntersection<UnionToIntersection<T extends (infer U)[] ? (U extends any ? InferField<U> : never) : never>>
  : InferField<T>;

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
