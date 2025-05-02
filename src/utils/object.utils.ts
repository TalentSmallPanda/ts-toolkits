import { ArrayUtils } from "..";
import { Nullable } from "./type";

export default class ObjectUtils {
  /**
   * 检查值是否为 null。
   * @param value 要检查的值
   * @example ObjectUtils.isNull(null)        = true
   * @example ObjectUtils.isNull(undefinend)  = false
   * @example ObjectUtils.isNull({})          = false
   * @example ObjectUtils.isNull(1)           = false
   */
  public static isNull(value: any): value is null {
    return value === null;
  }

  /**
   * 检查值是否为 undefined。
   * @param value 要检查的值
   * @example ObjectUtils.isUndefinend(undefinend)  = true
   * @example ObjectUtils.isUndefinend(null)        = false
   * @example ObjectUtils.isUndefinend({})          = false
   * @example ObjectUtils.isUndefinend(1)           = false
   */
  public static isUndefinend(value: any): value is undefined {
    return typeof value === "undefined";
  }

  /**
   * 检查值是否为 null 或 undefined。
   * @param value 要检查的值
   * @example ObjectUtils.isNullOrUndefined(undefinend)  = true
   * @example ObjectUtils.isNullOrUndefined(null)        = true
   * @example ObjectUtils.isNullOrUndefined({})          = false
   * @example ObjectUtils.isNullOrUndefined(1)           = false
   */
  public static isNullOrUndefined(value: any): value is Nullable {
    return this.isNull(value) || this.isUndefinend(value);
  }

  /**
   * 检查值是否为数组。
   * @param value 要检查的值
   * @example ObjectUtils.isArray([])           = true
   * @example ObjectUtils.isArray(null)         = false
   * @example ObjectUtils.isArray(undefinend)   = false
   * @example ObjectUtils.isArray(1)            = false
   */
  public static isArray(value: any): value is Array<any> {
    return Array.isArray(value);
  }

  /**
   * 检查值是否为日期对象。
   * @param value 要检查的值
   * @example ObjectUtils.isDate(new Date())   = true
   * @example ObjectUtils.isDate(null)         = false
   * @example ObjectUtils.isDate(undefinend)   = false
   * @example ObjectUtils.isDate(1)            = false
   */
  public static isDate(value: any): value is Date {
    return value instanceof Date;
  }

  /**
   * 检查值是否为字符串。
   * @param value 要检查的值
   * @example ObjectUtils.isString("test")       = true
   * @example ObjectUtils.isString(null)         = false
   * @example ObjectUtils.isString(undefinend)   = false
   * @example ObjectUtils.isString(1)            = false
   */
  public static isString(value: any): value is string {
    return typeof value === "string";
  }

  /**
   * 检查值是否为数字。
   * @param value 要检查的值
   * @example ObjectUtils.isNumber(1)            = true
   * @example ObjectUtils.isNumber(null)         = false
   * @example ObjectUtils.isNumber(undefinend)   = false
   * @example ObjectUtils.isNumber("test")       = false
   */
  public static isNumber(value: any): value is number {
    return typeof value === "number";
  }

  /**
   * 检查值是否为布尔值。
   * @param value 要检查的值
   * @example ObjectUtils.isBoolean(false)        = true
   * @example ObjectUtils.isBoolean(null)         = false
   * @example ObjectUtils.isBoolean(undefinend)   = false
   * @example ObjectUtils.isBoolean("test")       = false
   */
  public static isBoolean(value: any): value is boolean {
    return typeof value === "boolean";
  }

  /**
   * 返回对象的字符串表示，即使值为 null 或 undefined。
   * @param value 要转换的值
   * @param defaultValue 默认值，当值为空时返回
   * @example ObjectUtils.toSafeString(null)            = ""
   * @example ObjectUtils.toSafeString(undefined)       = ""
   * @example ObjectUtils.toSafeString("test")          = "test"
   * @example ObjectUtils.toSafeString(null, "--")      = "--"
   * @example ObjectUtils.toSafeString(undefined, "--") = "--"
   */
  public static toSafeString(value: any, defaultValue = ""): string {
    if (this.isNullOrUndefined(value)) {
      return defaultValue;
    } else {
      return value.toString();
    }
  }

  /**
   * 根据键获取对象的属性值。
   * @param obj 目标对象
   * @param key 键名
   */
  public static getProperty<T, K extends keyof T>(obj: T, key: K): any {
    return obj[key]; // 推断类型为 T[K]
  }

  /**
   * 设置对象的属性值。
   * @param obj 目标对象
   * @param key 键名
   * @param value 要设置的值
   */
  public static setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
    obj[key] = value;
  }

  /**
   * 根据类型创建对象。
   * @param type 对象类型
   */
  public static createObject<T>(type: new (...args: any) => T, ...args: any): T {
    if (this.isNullOrUndefined(type)) {
      return Object.create(null);
    }
    return new type(...args);
  }

  /**
   * 获取属性的名称。
   * @param key 键名
   */
  public static getPropertyName<T>(key: keyof T): string {
    return key.toString();
  }

  /**
   * 获取对象的所有属性值。
   * @param obj 目标对象
   */
  public static values(obj: any): any[] {
    if (this.isNullOrUndefined(obj)) {
      return [];
    }

    return Object.keys(obj).map((key) => obj[key]);
  }

  /**
   * 获取匹配的后代属性。
   * @param obj 目标对象
   * @param descendantPaths 后代路径
   * @example ObjectUtils.getDescendantProperty({p1: {p2 : 1}})             = {p1: {p2 : 1}}
   * @example ObjectUtils.getDescendantProperty({p1: {p2 : 1}}, "p1")       = {p2 : 1}
   * @example ObjectUtils.getDescendantProperty({p1: {p2 : 1}}, "p1", "p2") = 1
   * @example ObjectUtils.getDescendantProperty({p1: {p2 : 1}}, "p1", "p3") = undefined
   * @example ObjectUtils.getDescendantProperty(undefined)                  = undefined
   * @example ObjectUtils.getDescendantProperty(null)                       = undefined
   */
  public static getDescendantProperty(obj: any, ...descendantPaths: string[]): NonNullable<any> | undefined {
    if (this.isNullOrUndefined(obj)) {
      return undefined;
    }

    if (ArrayUtils.isEmpty(descendantPaths)) {
      return obj;
    }

    let descendantProperty = obj;
    for (const descendantPath of descendantPaths) {
      descendantProperty = descendantProperty[descendantPath];
      if (ObjectUtils.isNullOrUndefined(descendantProperty)) {
        return undefined;
      }
    }
    return descendantProperty;
  }

  /**
   * 如果值为 null 或 undefined 则返回默认值，否则返回原值。
   * @param value 要检查的值
   * @param defaultValue 默认值
   * @example ObjectUtils.getOrDefault<number | undefined>(1, 0)            = "1"
   * @example ObjectUtils.getOrDefault<number | undefined>(undefined, 0)    = "0"
   * @example ObjectUtils.getOrDefault<number | null>(1, 0)                 = "1"
   * @example ObjectUtils.getOrDefault<number | null>(null, 0)              = "0"
   */
  public static getOrDefault<T>(value: T | null | undefined, defaultValue: NonNullable<T>): NonNullable<T> {
    if (!this.isNullOrUndefined(value)) {
      return value as NonNullable<T>;
    }
    return defaultValue;
  }

  /**
   * 指示当前对象是否有值。
   * @param object 要检查的对象
   * @returns 如果当前对象不是 null 或 undefined，则返回 true，否则返回 false。
   * @example ObjectUtils.hasValue(1)           = true
   * @example ObjectUtils.hasValue("str")       = true
   * @example ObjectUtils.hasValue(undefined)   = false
   * @example ObjectUtils.hasValue(null)        = false
   */
  public static hasValue<T>(object: T): object is NonNullable<T> {
    return !this.isNullOrUndefined(object);
  }
}
