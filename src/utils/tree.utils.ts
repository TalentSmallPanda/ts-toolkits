import { ArrayUtils, IsLast, IsVisible, ObjectUtils, RandomUtils, TreeLevel } from "..";
import { BaseTreeData, BaseTreeItem, FieldItem, ListToTreeOps, MergeFields, TreeItem, UpdateOperation } from "./type";

export default class TreeUtils {
  /**
   * 初始化树形结构
   *
   * 此方法用于将给定的列表转换为树形结构它接受一个列表、展开级别、是否具有唯一键和子字段名称作为参数
   * 展开级别的默认值为 -1，表示全部展开如果树节点需要基于唯一键进行标识，则可以设置 hasUniKey 为 true
   * 子字段名称可以根据需要进行更改，默认为 'children'
   *
   * @param list - 需要转换为树形结构的列表
   * @param expandLevel - 树的展开级别，默认为 -1，表示全部不展开
   * @param hasUniKey - 树节点是否具有唯一键，默认为 false
   * @param childField - 子节点的字段名称，默认为 'children'
   * @returns 返回转换后的树形结构数组
   */
  public static initTree<T>(
    list: T[],
    expandLevel = -1,
    hasUniKey = false,
    childField = "children" as keyof T
  ): TreeItem<T>[] {
    return this.init(list, expandLevel, hasUniKey, childField);
  }

  /**
   * 初始化扁平树结构
   *
   * 此方法用于将一个扁平的列表转换成树形结构它可以应用于各种类型的对象列表，
   * 只要这些对象包含适当的属性来表示层级关系通过传入不同的参数，可以控制树形结构的
   * 展开级别、是否存在唯一键以及子节点的字段名称
   *
   * @param list 扁平列表，包含一系列对象，这些对象应包含指定的属性来表示父-child关系
   * @param expandLevel 展开树形结构的级别默认为-1，表示全部不展开
   * @param hasUniKey 指示对象中是否包含唯一的标识符如果为true，每个对象都应有一个唯一的键值
   * @param childField 对象中表示子节点的属性名默认为'children'，即每个对象都应有这个属性来存储其子节点
   * @returns 返回一个树形结构的数组，每个元素都是一个带有层级关系的节点
   */
  public static initFlatTree<T>(
    list: T[],
    expandLevel = -1,
    hasUniKey = false,
    childField = "children" as keyof T
  ): TreeItem<T>[] {
    return this.init(list, expandLevel, hasUniKey, childField, true);
  }

  public static init<T>(
    list: T[],
    expandLevel = -1,
    hasUniKey = false,
    childField: keyof T,
    isFlat = false,
    array: TreeItem<T>[] = [],
    depth = TreeLevel.One,
    idxs: number[] = [],
    lastArray: number[] = [],
    visible = IsVisible.Y
  ): TreeItem<T>[] {
    const length = list.length;
    for (let index = 0; index < length; index++) {
      const item = list[index] as TreeItem<T>;
      const indexs = idxs.concat([index]);
      const isLast = index === length - 1;
      const curLtArray = lastArray.concat([isLast ? IsLast.T : IsLast.F]);
      item._idxs = indexs;
      item._level = depth;
      item._visible = visible;
      item._expanded = depth <= expandLevel;
      item._isFather = ArrayUtils.isNotEmpty(item[childField]);
      item._lastArray = curLtArray;
      if (hasUniKey) {
        item._uniKey = indexs.join("-");
      }
      if (isFlat) {
        array.push(item);
      }
      const childList = ArrayUtils.isNotEmpty(item[childField])
        ? this.init(
            item[childField],
            expandLevel,
            hasUniKey,
            childField,
            isFlat,
            isFlat ? array : [],
            depth + 1,
            indexs,
            curLtArray,
            item._expanded ? IsVisible.Y : IsVisible.N
          )
        : [];
      if (!isFlat) {
        item.children = childList;
        array.push(item);
      }
    }
    return array;
  }

  /**
   *  @description:  createTree  create a tree structure data with the given fields and the given number of nodes on each level
   *  @param fields:  the array of fields to be created for each node
   *  @param maxLevel:  the max level of the tree structure data
   *  @param num:  the number of nodes on each level
   *  @param depth:  the current level of the tree structure data
   *  @param idxs:  the array of indexs of the parent node
   *  @return:  the tree structure data
   */
  public static createTree<T extends [FieldItem, ...FieldItem[]]>(
    fields = ["id"] as unknown as T,
    maxLevel = 2,
    num = 10,
    depth = 0,
    idxs: number[] = []
  ): BaseTreeData<MergeFields<T>>[] {
    if (depth > maxLevel) return [];
    return Array(num)
      .fill("")
      .map((_, index) => {
        const indexs = idxs.concat([index]);
        const uniStr = indexs.join("_");
        const obj: any = {};
        fields.forEach((field) => {
          if (typeof field === "string") {
            obj[field] = `${field}_${uniStr}`;
          } else if (field !== null && typeof field === "object") {
            const [fieldName, fieldValue] = Object.entries(field)[0];
            let val: unknown;
            if (typeof fieldValue === "number") {
              if (Number.isInteger(fieldValue)) {
                val = RandomUtils.getInt();
              } else {
                const decimalPlaces = (fieldValue.toString().split(".")[1] || "").length; // 获取小数位数
                const precision = decimalPlaces > 0 ? decimalPlaces : 2;
                val = RandomUtils.getFloat(0, 1000, precision);
              }
            } else if (typeof fieldValue === "boolean") {
              val = RandomUtils.getBoolean();
            } else if (typeof fieldValue === "string") {
              if (fieldValue === "uuid") {
                val = RandomUtils.getUuid();
              } else if (fieldValue === "email") {
                val = RandomUtils.getEmail();
              } else if (fieldValue === "img") {
                val = RandomUtils.getImage();
              } else if (fieldValue === "name") {
                val = RandomUtils.getEnName();
              } else if (fieldValue === "address") {
                val = RandomUtils.getEnAddress();
              } else {
                val = RandomUtils.getString();
              }
            } else {
              val = `${field}_${uniStr}`;
            }
            obj[fieldName] = val;
          }
        });
        obj.children = this.createTree(fields, maxLevel, num, depth + 1, indexs);
        return obj;
      });
  }

  /**
   *  @description:  expandTree  traverse the tree structure data and set the expanded status according to the given expands array
   *  @param list:  the tree structure data
   *  @param expands:  the array of keys to be expanded
   *  @param key:  the key of the node in the tree structure data that is used to determine whether the node is expanded or not
   *  @return:  the tree structure data with the expanded status set
   */
  public static expandTree<T = any>(
    list: T[],
    expands: string[] | number,
    expandField?: keyof T,
    key?: typeof expands extends number ? never : keyof T
  ): T[] {
    const newSortRows: T[] = [];
    const loop = (array: T[], depth = TreeLevel.One) => {
      while (ArrayUtils.isNotEmpty(array)) {
        const item = array.shift() as any;
        let shouldExpand = false;
        if (Array.isArray(expands)) {
          const expandSets = new Set(expands);
          shouldExpand = expandSets.has(item[key]);
        } else {
          shouldExpand = depth <= expands;
        }
        item[expandField ?? "_expanded"] = shouldExpand;
        newSortRows.push(item);
        if (shouldExpand && ArrayUtils.isNotEmpty(item.children)) {
          const children: T[] = item.children;
          loop(children.slice(), depth + 1);
        }
      }
    };
    loop(list);
    return newSortRows;
  }

  /**
   * @param {T[]} list  The list of data to be converted to tree data
   * @param {string | undefined | null | number} parentKey  The parent key of the tree data
   * @param {ListToTreeOps<T>} [ops]  The options for converting list to tree data
   * @param {number} [depth=0]  The depth of the tree data
   * @returns {BaseTreeData[]}  The converted tree data
   */
  public static handleListToTree<T>(
    list: T[],
    parentKey: string | number | undefined | null,
    ops: ListToTreeOps<T>
  ): BaseTreeData<T>[] {
    if (!ObjectUtils.isArray(list) || (ObjectUtils.isNumber(ops.maxLevel) && ops.maxLevel < 0)) {
      return [];
    }
    if (ArrayUtils.isEmpty(list)) {
      return [];
    }
    const nodeMap = new Map<T[keyof T], BaseTreeData<T>>();
    for (const item of list) {
      const uniqueId = item[ops.keyField];
      nodeMap.set(uniqueId, Object.assign({}, item, { children: [] }));
    }
    const array: BaseTreeData<T>[] = [];
    for (const item of list) {
      const parentId = item[ops.parentKeyField];
      const uniqueId = item[ops.keyField];
      const node = nodeMap.get(uniqueId)!;
      if (parentId === parentKey) {
        array.push(node);
      } else {
        const parentNode = nodeMap.get(parentId)!;
        parentNode.children.push(node);
      }
    }
    if (ObjectUtils.isNumber(ops.maxLevel)) {
      this.handleListDepth(array, Math.floor(ops.maxLevel), 0);
    }
    return array;
  }

  private static handleListDepth<T>(list: BaseTreeData<T>[], maxLevel: number, depth: number): BaseTreeData<T>[] {
    for (const item of list) {
      item.children = depth < maxLevel ? this.handleListDepth(item.children, maxLevel, depth + 1) : [];
    }
    return list;
  }

  /**
   * Get a tree item by its ids.
   * @param data The tree data.
   * @param idxs The ids of the item.
   * @returns The item if found, null otherwise.
   */
  public static getTreeItemByIdxs<T>(data: T[], idxs: number[]): T | null {
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
  }

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
    const list = data.filter((o) => o._level === TreeLevel.One);
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
    const list = data.filter((o) => o._level === TreeLevel.One);
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
    const list = data.filter((o) => o._level === TreeLevel.One);
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
