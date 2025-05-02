import ObjectUtils from "./object.utils";

export default class DateUtils {
  private static timeFormatRegex = /yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s|SSS|S/g;

  /**
   * 返回自 1970-01-01T00:00:00.000Z 以来已经过去的毫秒数。
   * @param date
   * @example DateUtils.dateToTimestamp(null) = 0
   * @example DateUtils.dateToTimestamp(undefined) = 0
   * @example DateUtils.dateToTimestamp(new Date("Tue, 19 Jun 2018 00:00:00 GMT")) = 1529366400000
   */
  public static dateToTimestamp(date: Date): number {
    if (ObjectUtils.isNullOrUndefined(date)) {
      return 0;
    }
    return date.getTime();
  }

  /**
   * 从自 1970-01-01T00:00:00.000Z 以来已经过去的毫秒数获取日期。
   * @param timestamp
   * @example DateUtils.timestampToDate(1529366400) = new Date("Tue, 19 Jun 2018 00:00:00 GMT")
   */
  public static timestampToDate(timestamp: number): Date {
    return new Date(timestamp);
  }

  /**
   * 获取当前日期，不包含小时、分钟和秒。
   */
  public static getToday(): Date {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }

  /**
   * 使用指定格式将当前日期的值转换为其等效的字符串表示形式。
   * @param date
   * @param format
   * "yyyy" 以四位数字表示的年份。
   * "yy" 年份的后两位数字；小于10的年份前导零。
   * "MM" 以数字表示的月份；单数字月份前导零。
   * "M" 以数字表示的月份；单数字月份无前导零。
   * "dd" 以数字表示的月份中的日期；单数字日期前导零。
   * "d" 以数字表示的月份中的日期；单数字日期无前导零。
   * "HH" 小时；单数字小时前导零（24小时制）。
   * "H" 小时；单数字小时无前导零（24小时制）。
   * "mm" 分钟；单数字分钟前导零。
   * "m" 分钟；单数字分钟无前导零。
   * "ss" 秒；单数字秒前导零。
   * "s" 秒；单数字秒无前导零。
   * "SSS" 毫秒；单数字毫秒前导零。
   * "S" 毫秒；单数字毫秒无前导零。
   */
  public static toString(date: Date, format: string): string {
    return format.replace(this.timeFormatRegex, (matched) => this.getTimeFormat(false, date, matched));
  }

  /**
   * 使用指定格式将当前UTC日期的值转换为其等效的字符串表示形式。
   * @param date
   * @param format
   * "yyyy" 以四位数字表示的年份。
   * "yy" 年份的后两位数字；小于10的年份前导零。
   * "MM" 以数字表示的月份；单数字月份前导零。
   * "M" 以数字表示的月份；单数字月份无前导零。
   * "dd" 以数字表示的月份中的日期；单数字日期前导零。
   * "d" 以数字表示的月份中的日期；单数字日期无前导零。
   * "HH" 小时；单数字小时前导零（24小时制）。
   * "H" 小时；单数字小时无前导零（24小时制）。
   * "mm" 分钟；单数字分钟前导零。
   * "m" 分钟；单数字分钟无前导零。
   * "ss" 秒；单数字秒前导零。
   * "s" 秒；单数字秒无前导零。
   * "SSS" 毫秒；单数字毫秒前导零。
   * "S" 毫秒；单数字毫秒无前导零。
   */
  public static toUTCString(date: Date, format: string): string {
    return format.replace(this.timeFormatRegex, (matched) => this.getTimeFormat(true, date, matched));
  }

  /**
   * 比较两个日期并返回一个值，指示一个是小于、等于还是大于另一个。
   * @param date1
   * @param date2
   * @returns
   * - 如果小于0，则date1小于date2。
   * - 如果为0，则date1等于date2。
   * - 如果大于0，则date1大于date2。
   */
  public static compare(date1: Date, date2: Date): number {
    const date1Time = date1.getTime();
    const date2Time = date2.getTime();

    if (date1Time === date2Time) {
      return 0;
    } else if (date1Time < date2Time) {
      return -1;
    } else {
      return 1;
    }
  }

  /**
   * 根据格式键获取时间格式字符串
   * @param isUTC 是否使用UTC时间
   * @param date 日期对象
   * @param formatKey 格式键
   * @returns 格式化后的时间字符串
   */
  private static getTimeFormat(isUTC: boolean, date: Date, formatKey: string): string {
    switch (formatKey) {
      case "yyyy":
        return (isUTC ? date.getUTCFullYear() : date.getFullYear()).toString();
      case "yy":
        return (isUTC ? date.getUTCFullYear() : date.getFullYear()).toString().substr(2);
      case "MM": {
        const month = isUTC ? date.getUTCMonth() + 1 : date.getMonth() + 1;
        return month >= 10 ? month.toString() : `0${month}`;
      }
      case "M":
        return (isUTC ? date.getUTCMonth() + 1 : date.getMonth() + 1).toString();
      case "dd": {
        const day = isUTC ? date.getUTCDate() : date.getDate();
        return day >= 10 ? day.toString() : `0${day}`;
      }
      case "d":
        return (isUTC ? date.getUTCDate() : date.getDate()).toString();
      case "HH": {
        const hour = isUTC ? date.getUTCHours() : date.getHours();
        return hour >= 10 ? hour.toString() : `0${hour}`;
      }
      case "H":
        return (isUTC ? date.getUTCHours() : date.getHours()).toString();
      case "mm": {
        const min = isUTC ? date.getUTCMinutes() : date.getMinutes();
        return min >= 10 ? min.toString() : `0${min}`;
      }
      case "m":
        return (isUTC ? date.getUTCMinutes() : date.getMinutes()).toString();
      case "ss": {
        const seconds = isUTC ? date.getUTCSeconds() : date.getSeconds();
        return seconds >= 10 ? seconds.toString() : `0${seconds}`;
      }
      case "s":
        return (isUTC ? date.getUTCSeconds() : date.getSeconds()).toString();
      case "SSS": {
        const milliseconds = isUTC ? date.getUTCMilliseconds() : date.getMilliseconds();
        return milliseconds >= 100
          ? milliseconds.toString()
          : milliseconds >= 10
          ? `0${milliseconds}`
          : `00${milliseconds}`;
      }
      case "S":
        return (isUTC ? date.getUTCMilliseconds() : date.getMilliseconds()).toString();
      default:
        return "";
    }
  }
}
