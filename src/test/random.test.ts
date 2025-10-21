import RandomUtils from "../utils/random.utils";

describe("RandomUtils", () => {
  describe("getInt", () => {
    it("应在指定范围内生成随机整数", () => {
      const min = 1;
      const max = 10;
      const result = RandomUtils.getInt(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    it("应处理默认最大值", () => {
      const min = 1;
      const result = RandomUtils.getInt(min);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
    });

    it("应处理负数范围", () => {
      const min = -10;
      const max = -1;
      const result = RandomUtils.getInt(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });
  });

  describe("getString", () => {
    it("应生成指定长度的随机字符串", () => {
      const length = 15;
      const result = RandomUtils.getString(length);
      expect(result).toHaveLength(length);
    });

    it("应使用默认字符集", () => {
      const result = RandomUtils.getString();
      const defaultCharacterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (const char of result) {
        expect(defaultCharacterSet).toContain(char);
      }
    });

    it("应使用自定义字符集", () => {
      const customCharacterSet = "abc";
      const result = RandomUtils.getString(10, customCharacterSet);
      for (const char of result) {
        expect(customCharacterSet).toContain(char);
      }
    });
  });

  describe("getImage", () => {
    it("应生成正确的图片URL", () => {
      const width = 200;
      const height = 150;
      const result = RandomUtils.getImage(width, height);
      expect(result).toMatch(/^https:\/\/picsum\.photos\/200\/150\?random=\d+$/);
    });
  });

  describe("getColor", () => {
    it("应生成有效的十六进制颜色码", () => {
      const result = RandomUtils.getColor();
      expect(result).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  describe("getBoolean", () => {
    it("应生成布尔值", () => {
      const result = RandomUtils.getBoolean();
      expect(typeof result).toBe("boolean");
    });
  });

  describe("getFloat", () => {
    it("应在指定范围内生成随机浮点数", () => {
      const min = 1.5;
      const max = 2.5;
      const result = RandomUtils.getFloat(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    it("应处理默认范围", () => {
      const result = RandomUtils.getFloat();
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });

  describe("getPhone", () => {
    it("应生成格式正确的电话号码", () => {
      const result = RandomUtils.getPhone();
      expect(result).toMatch(/^\d{3}-\d{3}-\d{4}$/);
    });
  });

  describe("getEmail", () => {
    it("应生成格式正确的电子邮件地址", () => {
      const domain = "example.com";
      const result = RandomUtils.getEmail(domain);
      expect(result).toMatch(/^[a-zA-Z0-9._%+-]+@example\.com$/);
    });

    it("应使用默认域名", () => {
      const result = RandomUtils.getEmail();
      expect(result).toMatch(/^[a-zA-Z0-9._%+-]+@qq\.com$/);
    });
  });

  describe("getDate", () => {
    it("应在指定日期范围内生成随机日期", () => {
      const start = new Date(2020, 0, 1);
      const end = new Date(2020, 11, 31);
      const result = RandomUtils.getDate(start, end);
      expect(result.getTime()).toBeGreaterThanOrEqual(start.getTime());
      expect(result.getTime()).toBeLessThanOrEqual(end.getTime());
    });

    it("应处理默认范围", () => {
      const result = RandomUtils.getDate();
      const now = new Date();
      expect(result.getTime()).toBeLessThanOrEqual(now.getTime());
    });
  });

  describe("getEnName", () => {
    it("应生成带有首字母大写的名字和姓氏", () => {
      const result = RandomUtils.getEnName();
      const [firstName, lastName] = result.split(" ");

      // 检查名字和姓氏存在且首字母大写
      expect(firstName).toBeDefined();
      expect(lastName).toBeDefined();
      expect(firstName[0]).toBe(firstName[0].toUpperCase());
      expect(lastName[0]).toBe(lastName[0].toUpperCase());

      // 检查长度范围
      expect(firstName.length).toBeGreaterThanOrEqual(3);
      expect(firstName.length).toBeLessThanOrEqual(7);
      expect(lastName.length).toBeGreaterThanOrEqual(4);
      expect(lastName.length).toBeLessThanOrEqual(10);
    });

    it("应只包含字母和空格", () => {
      const result = RandomUtils.getEnName();
      // 检查只包含字母和一个空格
      expect(result).toMatch(/^[A-Za-z]+ [A-Za-z]+$/);
    });
  });

  describe("getEnAddress", () => {
    it("应生成符合格式的随机地址", () => {
      const result = RandomUtils.getEnAddress();
      const parts = result.split(", ");

      // 检查格式：街道, 城市, 州+邮编
      expect(parts.length).toBe(3);
      const [street, city, stateZip] = parts;

      // 检查街道部分
      const streetParts = street.split(" ");
      expect(streetParts.length).toBe(3); // 数字 + 街道名 + "St"
      const streetNumber = parseInt(streetParts[0], 10);
      expect(streetNumber).toBeGreaterThanOrEqual(1);
      expect(streetNumber).toBeLessThanOrEqual(999);
      expect(streetParts[2]).toBe("St");

      // 检查城市长度
      expect(city.length).toBeGreaterThanOrEqual(4);
      expect(city.length).toBeLessThanOrEqual(8);

      // 检查州和邮编
      const [state, zipCode] = stateZip.split(" ");
      expect(state.length).toBe(2);
      expect(parseInt(zipCode, 10)).toBeGreaterThanOrEqual(10000);
      expect(parseInt(zipCode, 10)).toBeLessThanOrEqual(99999);
    });

    it("应只包含字母、数字、空格和逗号", () => {
      const result = RandomUtils.getEnAddress();
      // 检查只包含合法字符
      expect(result).toMatch(/^[0-9]+ [A-Za-z]+ St, [A-Za-z]+, [A-Z]{2} [0-9]{5}$/);
    });
  });

  describe("getUuid", () => {
    it("应生成有效的UUID", () => {
      const result = RandomUtils.getUuid();
      expect(result).toMatch(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
    });

    it("应生成符合 UUID v4 标准的 UUID", () => {
      const result = RandomUtils.getUuid();
      // 检查格式：8-4-4-4-12
      const parts = result.split("-");
      expect(parts.length).toBe(5);
      expect(parts[0].length).toBe(8);
      expect(parts[1].length).toBe(4);
      expect(parts[2].length).toBe(4);
      expect(parts[3].length).toBe(4);
      expect(parts[4].length).toBe(12);

      // 检查版本位 (版本4的UUID第13位是4)
      const versionChar = result.charAt(14);
      expect(parseInt(versionChar, 16) & 0x4).toBe(4);

      // 检查变体位 (UUID变体位应为 10xx)
      const variantByte = parseInt(result.charAt(19), 16);
      expect(variantByte & 0x8).toBe(8); // 最高位为1
      expect(variantByte & 0x4).toBe(0); // 次高位为0
    });

    it("应生成唯一的UUID", () => {
      const uuids = new Set();
      for (let i = 0; i < 100; i++) {
        uuids.add(RandomUtils.getUuid());
      }
      // 确保生成了100个不同的UUID
      expect(uuids.size).toBe(100);
    });

    it("应在多次调用中保持一致的格式", () => {
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      for (let i = 0; i < 10; i++) {
        const result = RandomUtils.getUuid();
        expect(result).toMatch(uuidRegex);
      }
    });
  });

  describe("getChName", () => {
    it("应生成有效的中文名字（2-3个字）", () => {
      const result = RandomUtils.getChName();
      // 检查格式：中文字符，2-3个字
      expect(result).toMatch(/^[\u4e00-\u9fa5]{2,3}$/);
    });

    it("姓氏和名字应该在常用字符列表中", () => {
      const surnames =
        "王李张刘陈杨黄赵周吴徐孙马朱胡郭何林罗高梁郑谢宋唐许韩冯邓曹彭曾肖田董袁潘于蒋蔡余杜叶程苏魏吕丁任沈";
      const nameChars =
        "伟芳娜秀敏静丽强磊军洋勇艳杰娟涛明超霞平刚桂英华文波辉丹婷鹏燕玲飞红兰雪梅云鑫宇浩欣怡颖琳雨晨阳薇";

      const result = RandomUtils.getChName();
      expect(surnames).toContain(result[0]); // 姓氏

      const givenName = result.slice(1);
      for (const char of givenName) {
        expect(nameChars).toContain(char); // 名字
      }
    });

    it("应该生成多样化的名字", () => {
      const names = new Set<string>();
      for (let i = 0; i < 50; i++) {
        names.add(RandomUtils.getChName());
      }
      // 50个名字应该有较高的唯一性（至少40个不同）
      expect(names.size).toBeGreaterThanOrEqual(40);
    });
  });
});
