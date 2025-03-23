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
      expect(result).toBeLessThanOrEqual(1);
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
      const result = RandomUtils.getRandomEmail(domain);
      expect(result).toMatch(/^[a-zA-Z0-9._%+-]+@example\.com$/);
    });

    it("应使用默认域名", () => {
      const result = RandomUtils.getRandomEmail();
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

  describe("getUUID", () => {
    it("应生成有效的UUID", () => {
      const result = RandomUtils.getUUID();
      expect(result).toMatch(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{0,4}-[0-9a-fA-F]{0,12}$/);
    });
  });
});
