export default class RandomUtils {
  /**
   * 默认字符集，包含大小写字母和数字
   */
  private static readonly DEFAULT_CHARACTERS: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  /**
   * 小写字母字符集
   */
  private static readonly LOWERCASE_CHARACTERS: string = "abcdefghijklmnopqrstuvwxyz";

  /**
   * 常用姓氏（按人口比例精选50个最常见姓氏）
   */
  private static readonly CHINESE_SURNAMES: string =
    "王李张刘陈杨黄赵周吴徐孙马朱胡郭何林罗高梁郑谢宋唐许韩冯邓曹彭曾肖田董袁潘于蒋蔡余杜叶程苏魏吕丁任沈姜何";

  /**
   * 常用名字字符（精选适合做名字的常用字）
   */
  private static readonly CHINESE_NAME_CHARS: string =
    "伟芳娜秀敏静丽强磊军洋勇艳杰娟涛明超霞平刚桂英华文波辉丹婷鹏燕玲飞红兰雪梅云鑫宇浩欣怡颖琳雨晨阳薇莎曦云";

  /**
   * 生成指定范围内的随机整数
   * @param min 最小值（默认为0）
   * @param max 最大值（默认为最大安全整数）
   * @returns 生成的随机整数
   */
  static getInt(min = 0, max: number = Number.MAX_SAFE_INTEGER): number {
    [min, max] = [Math.ceil(min), Math.floor(max)];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 生成指定长度的随机字符串
   * @param length 字符串长度（默认为10）
   * @param characters 可选的字符集（默认使用大小写字母和数字）
   * @returns 生成的随机字符串
   */
  static getString(length = 10, characters: string = this.DEFAULT_CHARACTERS): string {
    const finalLength = length < 0 ? 10 : length;
    const finalCharacters = characters.length === 0 ? this.DEFAULT_CHARACTERS : characters;
    const charactersLength = finalCharacters.length;
    let result = "";
    for (let i = 0; i < finalLength; i++) {
      result += finalCharacters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * 生成随机图片URL（使用picsum.photos服务）
   * @param w 图片宽度（默认为100）
   * @param h 图片高度（默认为50）
   * @returns 随机图片的URL
   */
  static getImage(w = 100, h = 50): string {
    return "https://picsum.photos" + "/" + w + "/" + h + "?random=" + this.getInt();
  }

  /**
   * 生成随机颜色（16进制格式）
   * @returns 随机颜色的16进制字符串（如 "#ff0000"）
   */
  static getColor(): string {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  }

  /**
   * 生成随机布尔值
   * @returns 随机的true或false
   */
  static getBoolean(): boolean {
    return Math.random() >= 0.5;
  }

  /**
   * 生成指定范围和精度的随机浮点数
   * @param min 最小值（默认为0）
   * @param max 最大值（默认为100）
   * @param precision 小数点后的位数（默认为2）
   * @returns 生成的随机浮点数
   */
  static getFloat(min = 0, max = 100, precision = 2): number {
    const factor = Math.pow(10, precision);
    return Math.round((Math.random() * (max - min) + min) * factor) / factor;
  }

  /**
   * 生成随机电话号码（美国格式）
   * @returns 格式为"xxx-xxx-xxxx"的随机电话号码
   */
  static getPhone(): string {
    const area = RandomUtils.getInt(100, 999);
    const prefix = RandomUtils.getInt(100, 999);
    const line = RandomUtils.getInt(1000, 9999);
    return `${area}-${prefix}-${line}`;
  }

  /**
   * 生成随机电子邮件地址
   * @param domain 电子邮件域名（默认为"qq.com"）
   * @returns 生成的随机电子邮件地址
   */
  static getEmail(domain = "qq.com"): string {
    const username = this.getString(this.getInt(5, 15));
    return `${username}@${domain}`;
  }

  /**
   * 生成指定日期范围内的随机日期
   * @param start 起始日期（默认为2000年1月1日）
   * @param end 结束日期（默认为当前日期）
   * @returns 生成的随机日期
   */
  static getDate(start: Date = new Date(2000, 0, 1), end: Date = new Date()): Date {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
  }

  /**
   * 生成随机英文姓名
   * @returns 格式为"名 姓"的随机英文姓名
   */
  static getEnName(): string {
    const str = this.LOWERCASE_CHARACTERS;
    const firstNameLength = this.getInt(3, 7);
    const lastNameLength = this.getInt(4, 10);
    const firstName = this.getString(firstNameLength, str).replace(/^./, (c) => c.toUpperCase());
    const lastName = this.getString(lastNameLength, str).replace(/^./, (c) => c.toUpperCase());
    return `${firstName} ${lastName}`;
  }

  /**
   * 生成随机的中文名字
   * @returns 随机的中文姓名（如：张伟、李娜）
   */
  static getChName(): string {
    const surname = this.CHINESE_SURNAMES[Math.floor(Math.random() * this.CHINESE_SURNAMES.length)];
    const nameLength = Math.random() > 0.3 ? 2 : 1;
    let givenName = "";
    for (let i = 0; i < nameLength; i++) {
      givenName += this.CHINESE_NAME_CHARS[Math.floor(Math.random() * this.CHINESE_NAME_CHARS.length)];
    }
    return surname + givenName;
  }

  /**
   * 生成随机英文地址
   * @returns 格式为"门牌号 街道名 St, 城市, 州 邮编"的随机英文地址
   */
  static getEnAddress(): string {
    const str = this.LOWERCASE_CHARACTERS;
    const streetNumber = this.getInt(1, 999);
    const streetNameLength = this.getInt(5, 10);
    const streetName = this.getString(streetNameLength, str).replace(/^./, (c) => c.toUpperCase());
    const cityLength = this.getInt(4, 8);
    const city = this.getString(cityLength, str).replace(/^./, (c) => c.toUpperCase());
    const state = this.getString(2, str).toUpperCase();
    const zipCode = this.getInt(10000, 99999);
    return `${streetNumber} ${streetName} St, ${city}, ${state} ${zipCode}`;
  }

  /**
   * 生成随机UUID
   * @returns 符合UUID格式的随机字符串
   */
  static getUuid(): string {
    // 优先使用原生的crypto.randomUUID方法（如果可用）
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    // 回退方案1：使用crypto.getRandomValues生成UUID
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const buffer = new Uint8Array(16);
      crypto.getRandomValues(buffer);
      buffer[6] = (buffer[6] & 0x0f) | 0x40;
      buffer[8] = (buffer[8] & 0x3f) | 0x80;

      // 直接操作，避免Array.from和多次转换
      let uuid = "";
      for (let i = 0; i < 16; i++) {
        const hex = buffer[i].toString(16).padStart(2, "0");
        if (i === 4 || i === 6 || i === 8 || i === 10) {
          uuid += "-";
        }
        uuid += hex;
      }
      return uuid;
    }

    // 回退方案2：使用Math.random（最后的备选方案）
    const random = Math.floor(Math.random() * 0x10000000000000000)
      .toString(16)
      .padStart(16, "0");
    return `${random.slice(0, 8)}-${random.slice(8, 12)}-${random.slice(12, 16)}-${random.slice(16, 20)}-${random.slice(
      20
    )}`;
  }

  /**
   * UUID 生成器（别名）
   * @returns 符合UUID格式的随机字符串
   */
  static uuid(): string {
    return this.getUuid();
  }
}
