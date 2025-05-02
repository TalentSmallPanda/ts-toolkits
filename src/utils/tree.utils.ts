import { ArrayUtils, IsLast, IsVisible, ObjectUtils, RandomUtils, TreeLevel } from "..";
import { BaseTreeData, BaseTreeItem, FieldItem, ListToTreeOps, MergeFields, TreeItem, UpdateOperation } from "./type";

export default class TreeUtils {
  /**
   * 初始化树结构
   * @param list 源数据列表
   * @param expandLevel 默认展开层级，-1表示全部展开
   * @param hasUniKey 是否生成唯一键
   * @param childField 子节点字段名
   * @returns 初始化后的树结构数据
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
   * 初始化扁平化树结构
   * @param list 源数据列表
   * @param expandLevel 默认展开层级，-1表示全部展开
   * @param hasUniKey 是否生成唯一键
   * @param childField 子节点字段名
   * @returns 初始化后的扁平化树结构数据
   */
  public static initFlatTree<T>(
    list: T[],
    expandLevel = -1,
    hasUniKey = false,
    childField = "children" as keyof T
  ): TreeItem<T>[] {
    return this.init(list, expandLevel, hasUniKey, childField, true);
  }

  /**
   * 初始化树结构的内部实现方法
   * @param list 源数据列表
   * @param expandLevel 默认展开层级，-1表示全部展开
   * @param hasUniKey 是否生成唯一键
   * @param childField 子节点字段名
   * @param isFlat 是否扁平化
   * @param array 结果数组
   * @param depth 当前深度
   * @param idxs 索引数组
   * @param lastArray 节点是否为最后一个的标记数组
   * @param visible 节点是否可见
   * @returns 初始化后的树结构数据
   */
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
   * 创建具有给定字段和每个层级指定节点数的树结构数据
   * @param fields 为每个节点创建的字段数组
   * @param maxLevel 树结构数据的最大层级
   * @param num 每个层级上的节点数量
   * @param depth 树结构数据的当前层级
   * @param idxs 父节点的索引数组
   * @return 生成的树结构数据
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
   * 遍历树结构数据并根据给定的展开数组设置展开状态
   * @param list 树结构数据
   * @param expands 要展开的键数组或最大展开层级数字
   * @param expandField 用于存储展开状态的字段名
   * @param key 用于确定节点是否展开的树结构数据中节点的键
   * @return 设置了展开状态的树结构数据
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
   * 将列表转换为树结构
   * @param list 待转换的列表数据
   * @param parentKey 父节点的键值
   * @param ops 转换操作的配置选项
   * @returns 转换后的树结构数据
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

  /**
   * 处理列表深度，限制树的最大层级
   * @param list 树结构数据
   * @param maxLevel 最大层级
   * @param depth 当前深度
   * @returns 处理后的树结构数据
   */
  private static handleListDepth<T>(list: BaseTreeData<T>[], maxLevel: number, depth: number): BaseTreeData<T>[] {
    for (const item of list) {
      item.children = depth < maxLevel ? this.handleListDepth(item.children, maxLevel, depth + 1) : [];
    }
    return list;
  }

  /**
   * 根据索引数组获取树中的特定项
   * @param data 树数据
   * @param idxs 索引数组
   * @returns 找到的树节点，如果未找到则返回null
   */
  public static getTreeItemByIdxs<T>(data: T[], idxs: number[]): T | null {
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
   * 根据索引数组更新树中特定项的字段值
   * @param data 树数据
   * @param idxs 索引数组
   * @param field 要更新的字段
   * @param value 新的字段值
   * @returns 更新后的树数据
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
   * 根据多个更新操作批量更新树中的多个项
   * @param data 树数据
   * @param updates 更新操作数组
   * @returns 更新后的树数据
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
   * 根据索引数组删除树中的特定项
   * @param data 树数据
   * @param idxs 索引数组
   * @returns 删除后的树数据
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
   * 根据多个索引数组批量删除树中的多个项
   * @param data 树数据
   * @param idxsList 索引数组的数组
   * @returns 删除后的树数据
   */
  public static deleteTreeItemsByIdxs<T extends BaseTreeItem>(data: T[], idxsList: number[][]): T[] {
    let newData = data.slice();
    for (const idxs of idxsList) {
      newData = this.deleteTreeItemByIdxs(newData, idxs);
    }
    return newData;
  }
}
