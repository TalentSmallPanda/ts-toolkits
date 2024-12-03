export type Nullable = null | undefined;
export type BlankString = null | undefined | "";
export type NullableString = string | null | undefined;

export type NotEmptyArray<T> = [T, ...T[]];
export type EmptyArray = [];
export type NullableArray<T> = T[] | undefined | null;

export type TreeNode<T> = T & {
  children: TreeNode<T>[];
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
  keyField: keyof T & string;
};

export type ListToTreeOps<T> = BaseTreeOpinions<T> & {
  /*
   * parentKeyField 充当parentKey的字段
   */
  parentKeyField: keyof T & string;
};

export type UpdateOperation<T> = {
  idxs: number[];
  field: keyof T;
  value: any;
};
