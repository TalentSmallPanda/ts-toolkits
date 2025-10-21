import ObjectUtils from "./object.utils";

// IE中找不到isInteger和isSafeInteger方法
export default class NumberUtils {
  public static readonly MAX_SAFE_INTEGER: number = 9007199254740991;
  public static readonly MIN_SAFE_INTEGER: number = -9007199254740991;

  /**
   * 检查当前值是否为整数
   * @param value 要检查的值
   * @example Number.isInteger(0);         // true
   * @example Number.isInteger(1);         // true
   * @example Number.isInteger(-100000);   // true
   * @example Number.isInteger(99999999999999999999999); // true
   * @example Number.isInteger(0.1);       // false
   * @example Number.isInteger(Math.PI);   // false
   * @example Number.isInteger(NaN);       // false
   * @example Number.isInteger(Infinity);  // false
   * @example Number.isInteger(-Infinity); // false
   * @example Number.isInteger('10');      // false
   * @example Number.isInteger(true);      // false
   * @example Number.isInteger(false);     // false
   * @example Number.isInteger([1]);       // false
   */
  public static isInteger(value: any): boolean {
    return ObjectUtils.isNumber(value) && isFinite(value) && Math.floor(value) === value;
  }

  /**
   * 检查当前值是否为安全整数
   * @param value 要检查的值
   * @example Number.isSafeInteger(3);                    // true
   * @example Number.isSafeInteger(Math.pow(2, 53));      // false
   * @example Number.isSafeInteger(Math.pow(2, 53) - 1);  // true
   * @example Number.isSafeInteger(NaN);                  // false
   * @example Number.isSafeInteger(Infinity);             // false
   * @example Number.isSafeInteger('3');                  // false
   * @example Number.isSafeInteger(3.1);                  // false
   * @example Number.isSafeInteger(3.0);                  // true
   */
  public static isSafeInteger(value: any): boolean {
    return this.isInteger(value) && Math.abs(value) <= this.MAX_SAFE_INTEGER;
  }

  /**
   * 检查值是否可以转换为有效数字（包括数字字符串）。
   * @param value 要检查的值
   * @example NumberUtils.isNumeric(123)         = true
   * @example NumberUtils.isNumeric("123")       = true
   * @example NumberUtils.isNumeric("1.5")       = true
   * @example NumberUtils.isNumeric("-100")      = true
   * @example NumberUtils.isNumeric("abc")       = false
   * @example NumberUtils.isNumeric("")          = false
   * @example NumberUtils.isNumeric("  ")        = false
   * @example NumberUtils.isNumeric(null)        = false
   * @example NumberUtils.isNumeric(undefined)   = false
   * @example NumberUtils.isNumeric(NaN)         = false
   * @example NumberUtils.isNumeric(Infinity)    = false
   */
  public static isNumeric(value: any): boolean {
    if (ObjectUtils.isNullOrUndefined(value)) {
      return false;
    }
    // 排除布尔值
    if (typeof value === "boolean") {
      return false;
    }
    // 排除空字符串和纯空格字符串
    if (typeof value === "string" && value.trim() === "") {
      return false;
    }
    // 检查是否为有限数字（isFinite 会自动转换）
    return isFinite(value);
  }

  /**
   * 返回一个表示指定数字的固定小数点表示法的字符串
   * @param value 目标值
   * @param fractionDigits 小数点后的位数。必须在0-100范围内（包含）
   * @param defaultValue 如果值为空时的默认值
   */
  public static toFixed(value: number | null | undefined, fractionDigits: number, defaultValue?: string): string {
    if (ObjectUtils.isNullOrUndefined(value)) {
      return ObjectUtils.getOrDefault(defaultValue, "");
    }
    return value.toFixed(fractionDigits);
  }
}
