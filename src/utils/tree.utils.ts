import { ObjectUtils, ArrayUtils } from "..";
import { IsLast, TreeLevel } from "./enum";
import { ListToTreeOps, TreeItem, TreeNode } from "./type";

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
  public static initTree = <T extends TreeItem, K extends T>(
    list: T[],
    expandLevel = 0,
    depth = TreeLevel.One,
    idxs: number[] = [],
    lastArray: number[] = []
  ): K[] => {
    const list1: any[] = [];
    const length = list.length;
    for (let index = 0; index < length; index++) {
      const item = list[index];
      const indexs = idxs.concat([index]);
      const isLast = index === length - 1;
      const curLtArray = lastArray.concat([isLast ? IsLast.T : IsLast.F]);
      item.idxs = indexs;
      item.level = depth;
      item.lastArray = curLtArray;
      item.isFather = !!item.children?.length;
      item.expanded = depth < expandLevel;
      item.children =
        Array.isArray(item.children) && item?.children?.length > 0
          ? this.initTree(item.children, expandLevel, depth + 1, indexs, curLtArray)
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
    if (depth >= maxLevel) return [];
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
  public static expandTree = <T extends TreeItem, K = T>(list: T[], expands: string[], key: keyof K): T[] => {
    const newSortRows: T[] = [];
    const expandSets = new Set(expands);
    const loop = (rows: any[]) => {
      while (rows.length) {
        const node = rows.shift() as any;
        if (expandSets.has(node[key])) {
          node.expanded = true;
        } else {
          node.expanded = false;
        }
        newSortRows.push(node);
        if (expandSets.has(node[key]) && !!node.children?.length) {
          const children: T[] = node.children;
          // const lastIndex = children.length - 1;
          // children.forEach((child, index) => {
          //   child.isLast = index === lastIndex;
          // });
          loop([...children]);
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
   * @returns {TreeNode[]}  The converted tree data
   */
  public static handleListToTree = <T extends { [key: string]: any }>(
    list: T[],
    parentKey: string | undefined,
    ops: ListToTreeOps<T> = { keyField: "key", parentKeyField: "parentKey" },
    depth = 0
  ): TreeNode[] => {
    if (!Array.isArray(list)) {
      return [];
    }
    if (ArrayUtils.isEmpty(list)) {
      return [];
    }
    const array: TreeNode[] = [];
    for (const item of list) {
      if (item[`${ops.parentKeyField}`] === parentKey) {
        if (ObjectUtils.hasValue(ops.maxLevel) && depth >= Math.max(ops.maxLevel, 0) / 1) {
          array.push(item);
        } else {
          const list1 = list.filter((o) => o[`${ops.parentKeyField}`] !== parentKey);
          const chdList = this.handleListToTree(list1, item[`${ops.keyField}`], ops, depth + 1);
          if (ArrayUtils.isNotEmpty(chdList)) {
            Object.assign(item, { children: chdList });
          }
          array.push(item);
        }
      }
    }
    return array;
  };
}
