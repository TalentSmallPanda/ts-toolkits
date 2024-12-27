import { ObjectUtils, ArrayUtils } from "..";
import { IsLast, TreeLevel } from "./enum";
import { ListToTreeOps, BaseTreeItem, TreeData, TreeItem, UpdateOperation } from "./type";

export default class TreeUtils {
  /**
   *  @description:  initTree  traverse the tree structure data and set the necessary properties
   *  @param list:  the tree structure data
   *  @param expandLevel:  the initial expanded level
   *  @param depth:  the current node depth
   *  @param idxs:  the current node index array
   *  @param lastArray:  the last node index array
   *  @return:  the tree structure data with the necessary properties set
   */
  public static initTree = <T>(
    list: T[],
    expandLevel = -1,
    hasUniKey = false,
    depth = TreeLevel.One,
    idxs: number[] = [],
    lastArray: number[] = []
  ): TreeItem<T>[] => {
    const list1: TreeItem<T>[] = [];
    const length = list.length;
    for (let index = 0; index < length; index++) {
      const item = list[index] as TreeItem<T>;
      const indexs = idxs.concat([index]);
      const isLast = index === length - 1;
      const curLtArray = lastArray.concat([isLast ? IsLast.T : IsLast.F]);
      item.idxs = indexs;
      item.level = depth;
      item.lastArray = curLtArray;
      item.isFather = ArrayUtils.isNotEmpty(item.children);
      item.expanded = depth <= expandLevel;
      if (hasUniKey) {
        item.uniKey = indexs.join("-");
      }
      item.children = ArrayUtils.isNotEmpty(item.children)
        ? this.initTree(item.children, expandLevel, hasUniKey, depth + 1, indexs, curLtArray)
        : [];
      list1.push(item);
    }
    return list1;
  };

  /**
   *  @description:  createTree  create a tree structure data with the given fields and the given number of nodes on each level
   *  @param fields:  the array of fields to be created for each node
   *  @param maxLevel:  the max level of the tree structure data
   *  @param num:  the number of nodes on each level
   *  @param depth:  the current level of the tree structure data
   *  @param idxs:  the array of indexs of the parent node
   *  @return:  the tree structure data
   */
  public static createTree = (fields = ["id"], maxLevel = 2, num = 10, depth = 0, idxs: number[] = []): any[] => {
    if (depth > maxLevel) return [];
    return Array(num)
      .fill("")
      .map((_, index) => {
        const indexs = idxs.concat([index]);
        const uniStr = indexs.join("_");
        const obj: any = {};
        fields.forEach((field) => {
          obj[field] = `${field}_${uniStr}`;
        });
        obj.children = this.createTree(fields, maxLevel, num, depth + 1, indexs);
        return obj;
      });
  };

  /**
   *  @description:  expandTree  traverse the tree structure data and set the expanded status according to the given expands array
   *  @param list:  the tree structure data
   *  @param expands:  the array of keys to be expanded
   *  @param key:  the key of the node in the tree structure data that is used to determine whether the node is expanded or not
   *  @return:  the tree structure data with the expanded status set
   */
  public static expandTree = <T extends BaseTreeItem, K = T>(list: T[], expands: string[], key: keyof K): T[] => {
    const newSortRows: T[] = [];
    const expandSets = new Set(expands);
    const loop = (array: T[]) => {
      while (ArrayUtils.isNotEmpty(array)) {
        const item = array.shift() as any;
        if (expandSets.has(item[key])) {
          item.expanded = true;
        } else {
          item.expanded = false;
        }
        newSortRows.push(item);
        if (expandSets.has(item[key]) && ArrayUtils.isNotEmpty(item.children)) {
          const children: T[] = item.children;
          loop(children.slice());
        }
      }
    };
    loop(list);
    return newSortRows;
  };

  /**
   * @param {T[]} list  The list of data to be converted to tree data
   * @param {string | undefined} parentKey  The parent key of the tree data
   * @param {ListToTreeOps<T>} [ops]  The options for converting list to tree data
   * @param {number} [depth=0]  The depth of the tree data
   * @returns {TreeData[]}  The converted tree data
   */
  public static handleListToTree = <T>(
    list: T[],
    parentKey: string | undefined,
    ops: ListToTreeOps<T>,
    depth = 0
  ): TreeData<T>[] => {
    if (!ObjectUtils.isArray(list)) {
      return [];
    }
    if (ArrayUtils.isEmpty(list)) {
      return [];
    }
    const array: TreeData<T>[] = [];
    for (const item of list) {
      const itm = item as TreeData<T>;
      if (itm[`${String(ops.parentKeyField)}`] === parentKey) {
        if (ObjectUtils.hasValue(ops.maxLevel) && depth >= Math.max(ops.maxLevel, 0) / 1) {
          array.push(itm);
        } else {
          const list1 = list.filter((o) => o[`${String(ops.parentKeyField)}`] !== parentKey);
          const chdList = this.handleListToTree(list1, itm[`${String(ops.keyField)}`], ops, depth + 1);
          if (ArrayUtils.isNotEmpty(chdList)) {
            Object.assign(itm, { children: chdList });
          }
          array.push(itm);
        }
      }
    }
    return array;
  };

  /**
   * Get a tree item by its ids.
   * @param data The tree data.
   * @param idxs The ids of the item.
   * @returns The item if found, null otherwise.
   */
  public static getTreeItemByIdxs = <T>(data: T[], idxs: number[]): T | null => {
    /**
     * Get an item from the list by its index.
     * @param list The list of items.
     * @param depth The current depth.
     * @returns The item if found, null otherwise.
     */
    const getItem = (list: T[], depth = 0): T | null => {
      if (ArrayUtils.isEmpty(list) || depth > idxs.length) {
        return null;
      }
      let idx = idxs[depth];
      idx = Math.max(0, Math.min(idx, list.length - 1));
      const itm = list[idx] as any;
      if (!ObjectUtils.hasValue(itm)) {
        return null;
      }
      const chdList = itm.children;
      if (depth === idxs.length - 1 || ArrayUtils.isEmpty(chdList)) {
        return itm;
      } else {
        return getItem(chdList, depth + 1);
      }
    };
    return getItem(data);
  };

  /**
   * Update a tree item by its ids.
   * @param data The tree data.
   * @param idxs The ids of the item.
   * @param field The field to update.
   * @param value The new value.
   * @returns The updated data.
   */
  public static updateTreeItemByIdxs<T extends BaseTreeItem>(
    data: T[],
    idxs: number[],
    field: keyof T,
    value: any
  ): T[] {
    const list = data.filter((o) => o.level === TreeLevel.One);
    const item = this.getTreeItemByIdxs(list, idxs);
    if (ObjectUtils.hasValue(item)) {
      item[field] = value;
    }
    return data.slice();
  }

  /**
   * Updates multiple tree items in the tree data using the specified indices lists.
   * @param data The tree data.
   * @param updates An array of update operations.
   * @returns The updated tree data after the updates.
   */
  public static updateTreeItemsByIdxs<T extends BaseTreeItem>(data: T[], updates: UpdateOperation<T>[]): T[] {
    const list = data.filter((o) => o.level === TreeLevel.One);
    for (const update of updates) {
      const item = this.getTreeItemByIdxs(list, update.idxs);
      if (ObjectUtils.hasValue(item)) {
        item[update.field] = update.value;
      }
    }
    return data.slice();
  }

  /**
   * Deletes a tree item from the tree data using the specified indices list.
   * @param data The tree data.
   * @param idxs The indices of the tree item to delete.
   * @returns The updated tree data after deletion of specified item.
   */
  public static deleteTreeItemByIdxs<T extends BaseTreeItem>(data: T[], idxs: number[]): T[] {
    const list = data.filter((o) => o.level === TreeLevel.One);
    const parent = this.getTreeItemByIdxs(list, idxs.slice(0, -1)) as T;
    if (ObjectUtils.hasValue(parent) && ArrayUtils.isNotEmpty(parent.children)) {
      parent.children = parent.children.filter((_, i) => i !== idxs[idxs.length - 1]);
    }
    return data.slice();
  }

  /**
   * Deletes multiple tree items from the tree data using the specified indices list.
   * @param data The tree data.
   * @param idxsList A list of indices arrays, each representing the path to a tree item to delete.
   * @returns The updated tree data after deletion of specified items.
   */
  public static deleteTreeItemsByIdxs<T extends BaseTreeItem>(data: T[], idxsList: number[][]): T[] {
    let newData = data.slice();
    for (const idxs of idxsList) {
      newData = this.deleteTreeItemByIdxs(newData, idxs);
    }
    return newData;
  }
}
