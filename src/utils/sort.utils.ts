import ArrayUtils from "./array.utils";
import { SortOrder } from "./enum";
import { ComparatorThan, Compare, MergeSortOps, SortKey } from "./type";

export default class SortUtils {
  /**
   * 对数组进行归并排序
   * @template T - 数组元素类型
   * @param {T[]} list - 待排序的原始数组
   * @param {MergeSortOps<T>} [options={}] - 排序配置选项
   * @param {SortOrder} [options.order=SortOrder.DESC] - 排序顺序（升序/降序）
   * @param {string[]} [options.sortKeys=[]] - 多级排序的键路径数组
   * @param {Compare<T>} [options.compare] - 自定义比较函数
   * @param {boolean} [options.sortChild=false] - 是否递归排序子元素
   * @returns {T[]} - 排序后的数组（可能修改原数组引用）
   */
  public static sort<T>(list: T[], options: MergeSortOps<T> = {}): T[] {
    if (!Array.isArray(list) || list.length <= 1) {
      return list;
    }

    const {
      order = SortOrder.DESC,
      sortKeys = [],
      compare,
      sortChild = false,
      childField = "children" as keyof T,
    } = options;

    const compareFn: Compare<T> = this.createCompareFn(compare, order, sortKeys);

    return this.mergeSortInternal(list, compareFn, sortChild, childField);
  }

  /**
   * 执行归并排序的内部实现方法，支持对嵌套子元素的递归排序
   * @param array 待排序的原始数组
   * @param compareFn 元素比较函数，用于确定排序顺序
   * @param sortChild 是否对子元素进行递归排序的标志
   * @param childField 需要排序的子元素属性名称
   * @param start 排序的起始索引（默认0）
   * @param end 排序的结束索引（默认数组长度）
   * @returns 排序后的数组
   */
  private static mergeSortInternal<T>(
    array: T[],
    compareFn: Compare<T>,
    sortChild: boolean,
    childField: keyof T,
    start = 0,
    end = array.length
  ): T[] {
    if (end - start <= 1) {
      const result = array.slice(start, end) as any[];
      if (sortChild && Array.isArray(result?.[0]?.[childField]) && result?.[0]?.[childField]?.length > 0) {
        result[0].children = this.mergeSortInternal(result[0].children, compareFn, sortChild, childField);
      }
      return result;
    }

    const middle = start + Math.floor((end - start) / 2);
    const leftSorted = this.mergeSortInternal(array, compareFn, sortChild, childField, start, middle);
    const rightSorted = this.mergeSortInternal(array, compareFn, sortChild, childField, middle, end);

    return this.merge(leftSorted, rightSorted, compareFn);
  }

  /**
   * 根据提供的排序条件生成比较函数。
   * @param compare - 可选的自定义比较函数，用于直接比较两个元素
   * @param order - 排序顺序（升序或降序）
   * @param sortKeys - 多字段排序的键数组，按优先级顺序排列
   * @returns 生成的比较函数，符合排序规则的比较逻辑
   */
  private static createCompareFn<T>(
    compare: Compare<T> | undefined,
    order: SortOrder,
    sortKeys: SortKey<T>[]
  ): Compare<T> {
    if (ArrayUtils.isNotEmpty(sortKeys)) {
      return (a: T, b: T) => this.multiFieldCompare(a, b, sortKeys, order);
    } else if (compare) {
      return (a: T, b: T) => {
        const result = compare(a, b);
        return order === SortOrder.ASC ? result : result * -1;
      };
    } else {
      return (a: T, b: T) => {
        if (a === b) return ComparatorThan.Equal;
        const result = a < b ? ComparatorThan.LessThan : ComparatorThan.GreaterThan;
        return order === SortOrder.ASC ? result : result * -1;
      };
    }
  }

  /**
   * 根据多个排序键比较两个对象的静态方法
   * @param a - 要比较的第一个对象
   * @param b - 要比较的第二个对象
   * @param sortKeys - 排序键数组，每个键可以是字符串或包含排序配置的对象
   * @param defaultOrder - 当排序键未指定顺序时使用的默认排序方向
   * @returns 比较结果，返回ComparatorThan枚举值表示比较关系
   */
  private static multiFieldCompare<T>(a: T, b: T, sortKeys: SortKey<T>[], defaultOrder: SortOrder): ComparatorThan {
    for (const sortKey of sortKeys) {
      const key = typeof sortKey === "object" ? sortKey.key : sortKey;
      const fieldOrder = typeof sortKey === "object" ? sortKey.order : defaultOrder;
      const skipIf = typeof sortKey === "object" ? sortKey.skipIf : undefined;
      const transform = typeof sortKey === "object" ? sortKey.transform : undefined;
      const compare = typeof sortKey === "object" ? sortKey.compare : undefined;

      // 使用可选链提高健壮性
      const rawValueA = a?.[key];
      const rawValueB = b?.[key];

      // 应用 skipIf
      if (skipIf && (skipIf(rawValueA) || skipIf(rawValueB))) {
        continue;
      }

      // 优先使用自定义比较函数
      if (compare) {
        const result = compare(rawValueA, rawValueB);
        if (result !== ComparatorThan.Equal) {
          return fieldOrder === SortOrder.ASC ? result : result * -1;
        }
        continue;
      }

      // 应用 transform
      const valueA = transform ? transform(rawValueA) : rawValueA;
      const valueB = transform ? transform(rawValueB) : rawValueB;

      if (valueA === valueB) {
        continue;
      }
      const result = valueA < valueB ? ComparatorThan.LessThan : ComparatorThan.GreaterThan;
      return fieldOrder === SortOrder.ASC ? result : result * -1;
    }
    return ComparatorThan.Equal;
  }

  /**
   * 合并两个已排序的数组为一个有序数组
   * @param leftArray 左半部分已排序的数组
   * @param rightArray 右半部分已排序的数组
   * @param compareFn 元素比较函数，返回值应符合ComparatorThan枚举的比较规则
   * @returns 合并后的排序数组
   */
  private static merge<T>(leftArray: T[], rightArray: T[], compareFn: Compare<T>): T[] {
    const result = new Array<T>(leftArray.length + rightArray.length);
    let leftIndex = 0;
    let rightIndex = 0;
    let resultIndex = 0;

    // 合并两个有序数组: ComparatorThan.Equal = 0, LessThan = -1, GreaterThan = 1
    while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
      if (compareFn(leftArray[leftIndex], rightArray[rightIndex]) <= ComparatorThan.Equal) {
        result[resultIndex++] = leftArray[leftIndex++];
      } else {
        result[resultIndex++] = rightArray[rightIndex++];
      }
    }

    // 处理剩余元素
    while (leftIndex < leftArray.length) {
      result[resultIndex++] = leftArray[leftIndex++];
    }
    while (rightIndex < rightArray.length) {
      result[resultIndex++] = rightArray[rightIndex++];
    }

    return result;
  }
}
