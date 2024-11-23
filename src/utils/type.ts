export type Nullable = null | undefined;
export type BlankString = null | undefined | "";
export type NullableString = string | null | undefined;

export type NotEmptyArray<T> = [T, ...T[]];
export type EmptyArray = [];
export type NullableArray<T> = T[] | undefined | null;

export type TreeNode = {
  children?: TreeNode[];
  [key: string]: any; // 允许其他任意属性
};

export type TreeItem = {
  isLast?: boolean;
  expanded?: boolean;
  idxs: number[];
  level: number;
  lastArray: number[];
  isFather: boolean;
  children: any[];
  [key: string]: any;
};

type BaseTreeOpinions<T> = {
  /**
   * maxLevel 需要展示tree的层级
   */
  maxLevel?: number;
  /**
   * keyField  充当唯一标识的字段
   */
  keyField: keyof T & string;
};

export type ListToTreeOps<T> = BaseTreeOpinions<T> & {
  /*
   * parentKeyField 充当parentKey的字段
   */
  parentKeyField: keyof T & string;
};
