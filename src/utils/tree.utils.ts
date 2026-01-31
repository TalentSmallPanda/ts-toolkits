import ArrayUtils from "./array.utils";
import { IsLast, IsVisible, TreeLevel } from "./enum";
import ObjectUtils from "./object.utils";
import RandomUtils from "./random.utils";
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
   */
  public static init<T>(
    list: T[],
    expandLevel = -1,
    hasUniKey = false,
    childField: keyof T,
    isFlat = false
  ): TreeItem<T>[] {
    const len = list?.length;
    if (!len) {
      return [];
    }

    const result: TreeItem<T>[] = [];

    const MAX_DEPTH = 1024;
    const stackL = new Array<T[]>(MAX_DEPTH);
    const stackI = new Int32Array(MAX_DEPTH);
    const stackD = new Int16Array(MAX_DEPTH);
    const stackV = new Int8Array(MAX_DEPTH);
    const stackPIdx = new Array<number[]>(MAX_DEPTH);
    const stackPLast = new Array<number[]>(MAX_DEPTH);

    const stackPK = hasUniKey ? new Array<string>(MAX_DEPTH) : null;

    let top = 0;
    stackL[top] = list;
    stackI[top] = 0;
    stackD[top] = TreeLevel.One;
    stackV[top] = 1;
    stackPIdx[top] = [];
    stackPLast[top] = [];

    if (stackPK) {
      stackPK[top] = "";
    }

    while (top >= 0) {
      const l = stackL[top];
      const i = stackI[top];
      const d = stackD[top];
      const v = stackV[top] === 1 ? IsVisible.Y : IsVisible.N;
      const pIdx = stackPIdx[top];
      const pLast = stackPLast[top];

      if (i >= l.length) {
        top--;
        continue;
      }

      const item = l[i] as TreeItem<T>;
      const isLast = i === l.length - 1;
      const children = item[childField] as TreeItem<T>[];
      if (!isFlat && !ObjectUtils.hasValue(children)) {
        item[childField] = [] as TreeItem<T>[keyof T];
      }

      item._idxs = pIdx.concat(i);
      item._level = d;
      item._visible = v;
      item._expanded = d <= expandLevel;
      item._lastArray = pLast.concat(isLast ? IsLast.T : IsLast.F);

      const hasChildren = ArrayUtils.isNotEmpty(children);
      item._isFather = hasChildren;

      if (stackPK) {
        const pKey = stackPK[top];
        item._uniKey = pKey === "" ? `${i}` : `${pKey}-${i}`;
      }

      if (isFlat) {
        result.push(item);
      }

      stackI[top]++;

      if (hasChildren) {
        const nextTop = top + 1;

        if (nextTop < MAX_DEPTH) {
          const nextVisible = v === IsVisible.Y && item._expanded ? 1 : 0;

          stackL[nextTop] = children;
          stackI[nextTop] = 0;
          stackD[nextTop] = d + 1;
          stackV[nextTop] = nextVisible;
          stackPIdx[nextTop] = item._idxs;
          stackPLast[nextTop] = item._lastArray;

          if (stackPK) {
            stackPK[nextTop] = item._uniKey || "";
          }

          top = nextTop;
        } else {
          console.error(`[TreeInit] 栈溢出：深度超过 ${MAX_DEPTH}。`);
        }
      }
    }

    return isFlat ? result : (list as TreeItem<T>[]);
  }

  /**
   * 创建具有给定字段和每个层级指定节点数的树结构数据
   * @param fields 为每个节点创建的字段数组，支持多种类型：
   *   - 字符串: "id" → 生成 "id_0_1" 格式
   *   - 数字对象: { age: 0 } → 生成随机整数
   *   - 小数对象: { price: 0.0 } → 生成随机浮点数
   *   - 布尔对象: { active: true } → 生成随机布尔值
   *   - 特殊字符串: { email: "email" } → 生成随机邮箱
   *   - 支持的特殊类型: uuid, email, img, name, address, phone, color, cnName
   * @param maxLevel 树结构数据的最大层级
   * @param num 每个层级上的节点数量
   * @param depth 树结构数据的当前层级
   * @param idxs 父节点的索引数组
   * @return 生成的树结构数据
   * @example
   * TreeUtils.createTree(['id', { age: 0 }, { email: 'email' }, { phone: 'phone' }], 2, 5)
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
            obj[fieldName] = this.generateFieldValue(fieldValue, uniStr);
          }
        });
        obj.children = this.createTree(fields, maxLevel, num, depth + 1, indexs);
        return obj;
      });
  }

  /**
   * 根据字段值类型生成对应的随机数据
   * @param fieldValue 字段值，用于推断数据类型
   * @param uniStr 唯一标识符字符串
   * @returns 生成的字段值
   * @private
   */
  private static generateFieldValue(fieldValue: any, uniStr: string): unknown {
    if (typeof fieldValue === "number") {
      return this.generateNumberValue(fieldValue);
    } else if (typeof fieldValue === "boolean") {
      return RandomUtils.getBoolean();
    } else if (typeof fieldValue === "string") {
      return this.generateStringValue(fieldValue);
    }
    return `${fieldValue}_${uniStr}`;
  }

  /**
   * 生成数字类型的随机值
   * @param fieldValue 数字值，用于判断是整数还是浮点数
   * @returns 生成的随机数字
   * @private
   */
  private static generateNumberValue(fieldValue: number): number {
    if (Number.isInteger(fieldValue)) {
      return RandomUtils.getInt();
    } else {
      const decimalPlaces = (fieldValue.toString().split(".")[1] || "").length;
      const precision = decimalPlaces > 0 ? decimalPlaces : 2;
      return RandomUtils.getFloat(0, 1000, precision);
    }
  }

  /**
   * 根据字符串标识生成对应的随机数据
   * @param fieldValue 字符串标识，指定要生成的数据类型
   * @returns 生成的随机数据
   * @private
   */
  private static generateStringValue(fieldValue: string): string {
    switch (fieldValue) {
      case "uuid":
        return RandomUtils.getUuid();
      case "email":
        return RandomUtils.getEmail();
      case "img":
        return RandomUtils.getImage();
      case "name":
        return RandomUtils.getChName();
      case "address":
        return RandomUtils.getEnAddress();
      case "phone":
        return RandomUtils.getPhone();
      case "color":
        return RandomUtils.getColor();
      case "cnName":
        return RandomUtils.getChName();
      case "enName":
        return RandomUtils.getEnName();
      default:
        return RandomUtils.getString();
    }
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
    const expandSets = Array.isArray(expands) ? new Set(expands) : null;
    const maxLevel = typeof expands === "number" ? expands : -1;

    const loop = (array: T[], depth = TreeLevel.One) => {
      for (let i = 0; i < array.length; i++) {
        const item = array[i] as any;
        let shouldExpand = false;
        if (expandSets) {
          shouldExpand = expandSets.has(item[key]);
        } else {
          shouldExpand = depth <= maxLevel;
        }
        item[expandField ?? "_expanded"] = shouldExpand;
        newSortRows.push(item);
        if (shouldExpand && ArrayUtils.isNotEmpty(item.children)) {
          const children: T[] = item.children;
          loop(children, depth + 1);
        }
      }
    };
    loop(list);
    return newSortRows;
  }

  /**
   * 将扁平数组转换为树形结构
   * @param list 待转换的列表数据
   * @param parentKey 父节点的键值
   * @param ops 转换操作的配置选项
   * @returns 转换后的树结构数据
   */
  public static handleListToTree<T>(list: T[], parentKey: T[keyof T], ops: ListToTreeOps<T>): BaseTreeData<T>[] {
    const len = list?.length;
    if (!len || (typeof ops.maxLevel === "number" && ops.maxLevel < 0)) {
      return [];
    }

    const { keyField, parentKeyField, maxLevel } = ops;
    const limit = typeof maxLevel === "number" ? Math.floor(maxLevel) : Infinity;

    const nodeMap = new Map<T[keyof T], BaseTreeData<T>>();
    const rootNodes: BaseTreeData<T>[] = [];

    for (let i = 0; i < len; i++) {
      const item = list[i] as BaseTreeData<T>;
      item.children = [];
      item._d = -1;
      nodeMap.set(item[keyField], item);
    }

    for (let i = 0; i < len; i++) {
      const item = list[i] as BaseTreeData<T>;
      const pid = item[parentKeyField];
      const isRoot = pid === parentKey;

      if (isRoot) {
        item._d = 0;
        if (item._d <= limit) {
          rootNodes.push(item);
        }
      } else {
        if (item._d === -1) {
          this.resolveDepthIterative(item, nodeMap, parentKey, parentKeyField);
        }

        const parentNode = nodeMap.get(pid);
        // 安全挂载：父节点存在 && 自身深度已计算 && 未超限
        // (注：resolveDepthIterative 可能因为断头路导致 _d 依然算不对，或者循环引用，这里做一个 _d !== -1 的检查更稳健)
        if (parentNode && item._d !== -1 && item._d <= limit) {
          parentNode.children.push(item);
        }
      }
    }

    return rootNodes;
  }

  /**
   * 迭代式深度计算（带循环引用检测）
   * @param startNode 开始节点
   * @param map 节点映射
   * @param rootKey 根节点键值
   * @param pField 父节点键名
   */
  private static resolveDepthIterative<T>(
    startNode: BaseTreeData<T>,
    map: Map<T[keyof T], BaseTreeData<T>>,
    rootKey: T[keyof T],
    pField: keyof T
  ): void {
    const path: BaseTreeData<T>[] = [];
    const pathSet = new Set<BaseTreeData<T>>();
    let curr: BaseTreeData<T> | undefined = startNode;

    while (ObjectUtils.hasValue(curr) && curr._d === -1 && curr[pField] !== rootKey) {
      if (pathSet.has(curr)) {
        curr = undefined;
        break;
      }
      pathSet.add(curr);
      path.push(curr);

      const pid = curr[pField];
      curr = map.get(pid);
    }

    let depth = curr && curr._d !== -1 ? curr._d : 0;

    while (path.length > 0) {
      const node = path.pop()!;
      node._d = ++depth;
    }
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
