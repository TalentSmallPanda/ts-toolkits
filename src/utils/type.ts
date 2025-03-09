import { Operator } from "./enum";

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
  isLast?: boolean;
  expanded?: boolean;
  idxs: number[];
  level: number;
  lastArray: number[];
  isFather: boolean;
  uniKey: string;
  children: any[];
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
