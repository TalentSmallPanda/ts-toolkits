import NumberUtils from "./number.utils";
import ObjectUtils from "./object.utils";
import { EmptyArray, NotEmptyArray } from "./type";

export default class ArrayUtils {
  /**
   * 检查当前数组是否为空或 null/undefined。
   * @param array
   * @returns 如果数组为空或 null/undefined，则返回 true；否则，返回 false。
   * @throws 如果输入参数不是数组类型、null 或 undefined
   * @example ArrayUtils.isEmpty([]) = true;
   * @example ArrayUtils.isEmpty(null) = true;
   * @example ArrayUtils.isEmpty(undefined) = true;
   * @example ArrayUtils.isEmtpy([1]) = false;
   * @example ArrayUtils.isEmtpy("string") = true;
   * @example ArrayUtils.isEmtpy(123)  = true;
   */
  public static isEmpty<T>(array: T[] | undefined | null): array is EmptyArray {
    return !Array.isArray(array) || array.length === 0;
  }

  /**
   * 检查当前数组是否非空且不是 null/undefined。
   * @param array
   * @returns 如果数组为空或 null/undefined，则返回 false；否则，返回 true。
   * @throws 如果输入参数不是数组类型、null 或 undefined
   * @example ArrayUtils.isNotEmpty([]) = false;
   * @example ArrayUtils.isNotEmpty(null) = false;
   * @example ArrayUtils.isNotEmpty(undefined) = false;
   * @example ArrayUtils.isNotEmpty([1]) = true;
   * @example ArrayUtils.isNotEmpty("string") = false;
   * @example ArrayUtils.isNotEmpty(123) = false;
   */
  public static isNotEmpty<T>(array: T[] | undefined | null): array is NotEmptyArray<T> {
    return Array.isArray(array) && array.length > 0;
  }

  /**
   * 判断数组中是否包含指定元素。
   * @param array
   * @param item
   * @returns 如果数组中包含该元素，则返回 true；否则，返回 false。
   * @example ArrayUtils.contains(null, 1) = false
   * @example ArrayUtils.contains(undefined, 1) = false
   * @example ArrayUtils.contains([], 1) = false
   * @example ArrayUtils.contains([1,2,3], 1) = true
   * @example ArrayUtils.contains([1,2,3], 5) = false
   * @example ArrayUtils.contains([1,2,3], null) = false
   * @example ArrayUtils.contains([1,2,3], undefined) = false
   */
  public static contains<T>(array: T[], item: T): boolean {
    if (this.isEmpty(array) || ObjectUtils.isNullOrUndefined(item)) {
      return false;
    }
    return array.includes(item);
  }

  /**
   * 判断数组中是否包含候选项中的任意一个元素。
   * @param array
   * @param candidates
   * @returns 如果数组中包含候选项中的任意一个元素，则返回 true；否则，返回 false。
   * @example ArrayUtils.containsAny(null, [1, 2]) = false
   * @example ArrayUtils.containsAny(undefined, [1, 2]) = false
   * @example ArrayUtils.containsAny([1, 3, 5], [1, 2]) = true
   * @example ArrayUtils.containsAny([1, 3, 5], [2, 4, 6]) = false
   * @example ArrayUtils.containsAny([1, 3, 5], null) = false
   * @example ArrayUtils.containsAny([1, 3, 5], undefined) = false
   */
  public static containsAny<T>(array: T[], candidates: T[]): boolean {
    if (this.isEmpty(array) || this.isEmpty(candidates)) {
      return false;
    }

    const arraySet = new Set(array);
    for (const candidate of candidates) {
      if (arraySet.has(candidate)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 在数组的指定索引处插入元素。
   * @param array
   * @param index 应该插入元素的从零开始的索引。
   * @param item 要插入的对象。对于引用类型，该值可以为空。
   * @returns 如果插入成功则返回 true，否则返回 false。
   * @example ArrayUtils.insert([1, 3], 1, 2) ==> [1, 2, 3]
   * @example ArrayUtils.insert([1, 2], 100, 4) = false // 大于数组长度。
   */
  public static insert<T>(array: T[], index: number, item: T): boolean {
    if (!ObjectUtils.isArray(array) || !NumberUtils.isSafeInteger(index) || index > array.length) {
      return false;
    }
    const oldCount = array.length;
    array.splice(index, 0, item);
    return oldCount === array.length - 1;
  }

  /**
   * 从数组中移除特定对象的第一个匹配项。
   * @param array
   * @param item
   * @returns 如果成功移除项，则返回 true；否则，返回 false。
   * @example  ArrayUtils.remove([1, 2, 3], 2) = true
   * @example  ArrayUtils.remove([1, 2, 3], 5) = false
   */
  public static remove<T>(array: T[], item: T): boolean {
    if (!ObjectUtils.isArray(array)) {
      return false;
    }
    const index = array.indexOf(item);
    if (index < 0) {
      return false;
    }
    array.splice(index, 1);
    return true;
  }

  /**
   * 查找数组中的最大数值。
   * @param array
   * @returns 数字数组的最大值。
   * @example  ArrayUtils.max([1,5,3,2,4]) = 5
   */
  public static max(array: number[]): number {
    return Math.max.apply(null, array);
  }

  /**
   * 查找数组中的最小数值。
   * @param array
   * @returns 数字数组的最小值。
   * @example  ArrayUtils.min([1,5,3,2,4]) = 1
   */
  public static min(array: number[]): number {
    return Math.min.apply(null, array);
  }

  /**
   * 从数组的开头获取 n 个元素。
   * @param array
   * @param n 要获取的元素数量，默认为1
   * @returns 数组的切片。
   * @example  ArrayUtils.take([1, 2, 3, 4, 5]) = [1]
   * @example  ArrayUtils.take([1, 2, 3, 4, 5], null) = [1]
   * @example  ArrayUtils.take([1, 2, 3, 4, 5], NaN) = [1]
   * @example  ArrayUtils.take([1, 2, 3, 4, 5], 3) = [1, 2, 3]
   * @example  ArrayUtils.take([1, 2, 3, 4, 5], 0) = []
   * @example  ArrayUtils.take([1, 2, 3, 4, 5], -2) = []
   * @example  ArrayUtils.take([1, 2, 3, 4, 5], 10) = [1, 2, 3, 4, 5]
   */
  public static take<T>(array: T[], n?: number | undefined | null): T[] {
    const length = array.length;
    let takeN;
    if (ObjectUtils.isNullOrUndefined(n) || isNaN(n)) {
      takeN = 1;
    } else if (n <= 0) {
      takeN = 0;
    } else if (n < length) {
      takeN = n;
    } else {
      takeN = length;
    }
    return array.slice(0, takeN);
  }

  /**
   * 从数组的末尾创建包含 n 个元素的切片。
   * @param array
   * @returns 数组的切片。
   * @example  ArrayUtils.takeRight([1, 2, 3, 4, 5]) = [5]
   * @example  ArrayUtils.takeRight([1, 2, 3, 4, 5], null) = [5]
   * @example  ArrayUtils.takeRight([1, 2, 3, 4, 5], NaN) = [5]
   * @example  ArrayUtils.takeRight([1, 2, 3, 4, 5], 3) = [3, 4, 5]
   * @example  ArrayUtils.takeRight([1, 2, 3, 4, 5], 0) = []
   * @example  ArrayUtils.takeRight([1, 2, 3, 4, 5], -2) = []
   * @example  ArrayUtils.takeRight([1, 2, 3, 4, 5], 10) = [1, 2, 3, 4, 5]
   * @example  ArrayUtils.takeRight([1, 2, 3, 4, 5], Number.MAX_VALUE) = [1, 2, 3, 4, 5]
   */
  public static takeRight<T>(array: T[], n?: number | undefined | null): T[] {
    const length = array.length;
    let useStartIndex: number;
    if (ObjectUtils.isNullOrUndefined(n) || isNaN(n)) {
      useStartIndex = length - 1;
    } else if (n < 0) {
      useStartIndex = length;
    } else if (n < length) {
      useStartIndex = length - n;
    } else {
      useStartIndex = 0;
    }
    return array.slice(useStartIndex, length);
  }
}
