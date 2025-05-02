import { ChildQueryMode, Operator } from "..";
import { BaseCondition, Condition, ConditionGroup, Logic, QueryChunkOps } from "./type";

export default class QueryUtils {
  /**
   * 根据条件判断指定对象是否符合条件
   * @param item 需要查询的对象
   * @param condition 包含查询条件的对象
   * @returns 如果对象满足条件则返回true，否则返回false
   */
  private static queryCondition<T>(
    item: T,
    { field, operator, value, ignoreCase = true, compare }: BaseCondition<T>
  ): boolean {
    const itemValue = item[field] as string | number;
    // 优先使用自定义比较函数
    if (compare) {
      return compare(itemValue, value, item);
    }
    // 根据操作符类型进行不同处理
    return this.evaluateOperator(itemValue, operator, value, ignoreCase);
  }

  /**
   * 根据不同操作符评估条件
   * @private
   */
  private static evaluateOperator<T>(itemValue: T, operator: Operator, value: any, ignoreCase: boolean): boolean {
    // 预先转换数字值，避免重复转换
    const numValue = typeof value === "number" ? value : +value;

    switch (operator) {
      case Operator.EQUAL:
        return itemValue === value;
      case Operator.NOT_EQUAL:
        return itemValue !== value;
      case Operator.GREATER_THAN:
        return typeof itemValue === "number" ? itemValue > numValue : +itemValue > numValue;
      case Operator.LESS_THAN:
        return typeof itemValue === "number" ? itemValue < numValue : +itemValue < numValue;
      case Operator.GREATER_THAN_OR_EQUAL:
        return typeof itemValue === "number" ? itemValue >= numValue : +itemValue >= numValue;
      case Operator.LESS_THAN_OR_EQUAL:
        return typeof itemValue === "number" ? itemValue <= numValue : +itemValue <= numValue;
      case Operator.START_WITH:
      case Operator.END_WITH:
      case Operator.CONTAINS:
        return this.evaluateStringOperator(itemValue, operator, value, ignoreCase);
      case Operator.IN:
        return Array.isArray(value) && value.includes(itemValue);
      case Operator.NOT_IN:
        return Array.isArray(value) && !value.includes(itemValue);
      case Operator.BETWEEN:
        if (!Array.isArray(value) || value.length < 2) {
          throw new Error("BETWEEN requires a two-element array");
        }
        return typeof itemValue === "number" && +itemValue >= Number(value[0]) && +itemValue <= Number(value[1]);
      case Operator.BITWISE_ANY:
      case Operator.BITWISE_ZERO:
      case Operator.BITWISE_ALL:
        return this.evaluateBitwiseOperator(itemValue, operator, numValue);
      case Operator.REGEX:
        if (typeof itemValue !== "string" || typeof value !== "string") return false;
        try {
          return new RegExp(value).test(itemValue);
        } catch (e) {
          console.error(`无效的正则表达式模式: ${value}`);
          return false;
        }
      case Operator.IS_NULL:
        return itemValue === null || itemValue === undefined;
      case Operator.IS_NOT_NULL:
        return itemValue !== null && itemValue !== undefined;
      default:
        return true;
    }
  }

  /**
   * 处理字符串相关操作符
   * @private
   */
  private static evaluateStringOperator(itemValue: any, operator: Operator, value: any, ignoreCase: boolean): boolean {
    if (typeof itemValue !== "string") {
      return false;
    }
    const strValue = typeof value === "string" ? (ignoreCase ? value.toLowerCase() : value) : value + "";
    const strItemValue = ignoreCase ? itemValue.toLowerCase() : itemValue;
    switch (operator) {
      case Operator.START_WITH:
        return strItemValue.startsWith(strValue);
      case Operator.END_WITH:
        return strItemValue.endsWith(strValue);
      case Operator.CONTAINS:
        return strItemValue.includes(strValue);
      default:
        return false;
    }
  }

  /**
   * 处理位运算相关操作符
   * @private
   */
  private static evaluateBitwiseOperator(itemValue: any, operator: Operator, numValue: number): boolean {
    if (typeof itemValue !== "number" || isNaN(numValue)) {
      return false;
    }
    switch (operator) {
      case Operator.BITWISE_ANY:
        return (itemValue & numValue) > 0;
      case Operator.BITWISE_ZERO:
        return (itemValue & numValue) === 0;
      case Operator.BITWISE_ALL:
        return (itemValue & numValue) === numValue;
      default:
        return false;
    }
  }

  /**
   * 检查指定项是否满足给定的条件
   * @param item 需要验证的对象
   * @param condition 条件对象，可以是基础条件或条件组
   * @returns 如果满足条件则返回true，否则返回false
   */
  private static matchCondition<T>(item: T, condition: Condition<T>): boolean {
    if (this.isBaseCondition(condition)) {
      return this.queryCondition(item, condition);
    }

    const { logic: groupLogic, conditions } = condition as ConditionGroup<T>;
    for (const subCondition of conditions) {
      const subMatch = this.matchCondition(item, subCondition);
      if (groupLogic === "AND" && !subMatch) {
        return false;
      }
      if (groupLogic === "OR" && subMatch) {
        return true;
      }
    }
    return groupLogic === "AND";
  }

  /**
   * 类型守卫：判断是否为基础条件
   * @private
   */
  private static isBaseCondition<T>(condition: Condition<T>): condition is BaseCondition<T> {
    // eslint-disable-next-line no-prototype-builtins
    return condition.hasOwnProperty("field");
  }

  /**
   * 根据条件分块查询数据，并支持嵌套子项的递归查询
   * @param data 需要查询的数据源数组
   * @param conditions 查询条件数组（每个条件需符合Condition<T>类型）
   * @param groupLogic 条件组合逻辑（AND或OR，默认AND）
   * @param options 配置选项
   * @returns 过滤后的数据数组
   */
  public static queryChunk<T>(
    data: T[],
    conditions: Condition<T>[],
    groupLogic: Logic = "AND",
    options: QueryChunkOps<T> = {}
  ): T[] {
    // 参数验证
    if (!Array.isArray(data) || data.length === 0 || !Array.isArray(conditions)) {
      return [];
    }

    const {
      isHdChild = false,
      sourceChildField = "allChildren" as keyof T,
      chunkSize = 10000,
      childQueryMode = ChildQueryMode.PARENT_AND_CHILD,
      onItemMatch,
    } = options;
    if (chunkSize <= 0) {
      return [];
    }

    const group = { logic: groupLogic, conditions };
    const list: T[] = [];
    let shouldContinue = true;

    for (let i = 0; i < data.length && shouldContinue; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);

      for (const item of chunk) {
        let isMatchChild = false;
        let childList: T[] = [];

        // 根据查询模式处理父项和子项
        const isMatch = this.matchCondition(item, group);
        let shouldAdd = isMatch;

        // 处理子项
        if (isHdChild) {
          // 动态获取子项字段
          const childField = typeof sourceChildField === "function" ? sourceChildField(item) : sourceChildField;
          const children = item[childField as keyof T] as unknown as T[];
          if (Array.isArray(children) && children.length) {
            if (childQueryMode === ChildQueryMode.PARENT_ONLY) {
              shouldAdd = isMatch;
              (item as any).children = children;
            } else {
              childList = this.queryChunk(children, conditions, groupLogic, options);
              isMatchChild = childList.length > 0;
              (item as any).children = childList;
              if (childQueryMode === ChildQueryMode.PARENT_AND_CHILD) {
                // 如果提供了 onItemMatch 回调，使用回调决定是否添加
                if (onItemMatch) {
                  shouldAdd = onItemMatch({ item, isMatch, isMatchChild, childList });
                } else {
                  // 默认行为：父项且子项都匹配
                  shouldAdd = isMatch && isMatchChild;
                }
              } else if (childQueryMode === ChildQueryMode.CHILD_ONLY) {
                shouldAdd = isMatchChild;
              }
            }
          } else {
            if (childQueryMode === ChildQueryMode.CHILD_ONLY) {
              isMatchChild = isMatch;
              shouldAdd = isMatchChild;
            }
          }
        }

        if (shouldAdd) {
          list.push(item);
        }
      }

      // 优化：对于AND逻辑，如果结果为空，可以提前终止
      if (groupLogic === "AND" && list.length === 0) {
        shouldContinue = false;
      }
    }

    return list;
  }
}
