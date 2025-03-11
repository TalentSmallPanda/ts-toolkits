import { Operator } from "..";
import { BaseCondition, Condition, ConditionGroup, Logic, QueryChunkOps } from "./type";

export default class QueryUtils {
  /**
   * 根据条件判断指定对象是否符合条件
   * @param item 需要查询的对象
   * @param condition 包含查询条件的对象
   * @param condition.field 需要查询的字段名
   * @param condition.operator 操作符（如等于、大于等）
   * @param condition.value 比较值
   * @param condition.ignoreCase 是否忽略字符串比较时的大小写（默认true）
   * @param condition.compare 自定义比较函数（优先级高于预设操作符）
   * @returns 如果对象满足条件则返回true，否则返回false
   */
  private static queryCondition<T>(
    item: T,
    { field, operator, value, ignoreCase: ignoreCase = true, compare }: BaseCondition<T>
  ): boolean {
    const itemValue = item[field] as string | number;
    if (compare) return compare(itemValue, value);

    const numValue = +value!;

    switch (operator) {
      case Operator.EQUAL:
        return itemValue === value;
      case Operator.NOT_EQUAL:
        return itemValue !== value;
      case Operator.GREATER_THAN:
        return +itemValue > numValue;
      case Operator.LESS_THAN:
        return +itemValue < numValue;
      case Operator.GREATER_THAN_OR_EQUAL:
        return +itemValue >= numValue;
      case Operator.LESS_THAN_OR_EQUAL:
        return +itemValue <= numValue;
      case Operator.START_WITH:
      case Operator.END_WITH:
      case Operator.CONTAINS: {
        const strValue = typeof value === "string" ? (ignoreCase ? value.toLowerCase() : value) : value;
        const strItemValue =
          typeof itemValue === "string" ? (ignoreCase ? itemValue.toLowerCase() : itemValue) : itemValue;
        if (operator === Operator.START_WITH) {
          return typeof strItemValue === "string" && strItemValue.startsWith(strValue + "");
        } else if (operator === Operator.END_WITH) {
          return typeof strItemValue === "string" && strItemValue.endsWith(strValue + "");
        }
        return typeof strItemValue === "string" && strItemValue.includes(strValue + "");
      }
      case Operator.IN:
        return Array.isArray(value) && value.includes(itemValue);
      case Operator.NOT_IN:
        return Array.isArray(value) && !value.includes(itemValue);
      case Operator.BETWEEN:
        if (!Array.isArray(value) || value.length < 2) throw new Error("BETWEEN requires a two-element array");
        return typeof itemValue === "number" && +itemValue >= Number(value[0]) && +itemValue <= Number(value[1]);
      case Operator.BITWISE_ANY:
        if (typeof itemValue !== "number" || isNaN(numValue)) return false;
        return (itemValue & numValue) > 0;
      case Operator.BITWISE_ZERO:
        if (typeof itemValue !== "number" || isNaN(numValue)) return false;
        return (itemValue & numValue) === 0;
      case Operator.BITWISE_ALL:
        if (typeof itemValue !== "number" || isNaN(numValue)) return false;
        return (itemValue & numValue) === numValue;
      case Operator.REGEX:
        if (typeof itemValue !== "string" || typeof value !== "string") return false;
        return new RegExp(value).test(itemValue);
      case Operator.IS_NULL:
        return itemValue === null || itemValue === undefined;
      case Operator.IS_NOT_NULL:
        return itemValue !== null && itemValue !== undefined;
      default:
        return true;
    }
  }

  /**
   * 检查指定项是否满足给定的条件
   * @param item 需要验证的对象
   * @param condition 条件对象，可以是基础条件或条件组
   * @returns 如果满足条件则返回true，否则返回false
   */
  private static matchCondition<T>(item: T, condition: Condition<T>): boolean {
    // eslint-disable-next-line no-prototype-builtins
    if ((condition as BaseCondition<T>).hasOwnProperty("field")) {
      return this.queryCondition(item, condition as BaseCondition<T>);
    }

    const { logic: groupLogic, conditions } = condition as ConditionGroup<T>;
    let isMatch = groupLogic === "AND";
    for (const subCondition of conditions) {
      const subMatch = this.matchCondition(item, subCondition);
      if (groupLogic === "AND" && !subMatch) {
        isMatch = false;
        break;
      } else if (groupLogic === "OR" && subMatch) {
        isMatch = true;
        break;
      }
    }
    return isMatch;
  }

  /**
   * 根据条件分块查询数据，并支持嵌套子项的递归查询
   * @param data 需要查询的数据源数组
   * @param conditions 查询条件数组（每个条件需符合Condition<T>类型）
   * @param groupLogic 条件组合逻辑（AND或OR，默认AND）
   * @param options 配置选项
   * @param options.isHdChild 是否处理子项（true时会递归查询子元素）
   * @param options.sourceChildField 子元素所在的数据源字段（默认"allChildren"）
   * @param options.chunkSize 分块处理的大小（默认使用CHUNK_SIZE常量）
   * @returns 过滤后的数据数组
   */
  public static queryChunk<T>(
    data: T[],
    conditions: Condition<T>[],
    groupLogic: Logic = "AND",
    options: QueryChunkOps<T> = {}
  ): T[] {
    const group = { logic: groupLogic, conditions };
    const { isHdChild = false, sourceChildField = "allChildren" as keyof T, chunkSize = 10000 } = options;
    if (chunkSize <= 0) {
      return [];
    }
    let list: T[] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const chunkResult = chunk.filter((item) => {
        const isMatch = this.matchCondition(item, group);
        if (isHdChild && Array.isArray(item[sourceChildField]) && item[sourceChildField].length) {
          (item as any).children = this.queryChunk(item[sourceChildField], conditions, groupLogic, options);
          return isMatch && (item as any).children.length > 0;
        }
        return isMatch;
      });

      if (i === 0) {
        list = chunkResult;
      } else {
        list = list.concat(chunkResult);
      }
      if (groupLogic === "AND" && list.length === 0) break;
    }

    return list;
  }
}
