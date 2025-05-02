import DateUtils from "../utils/date.utils";

const nl = null as unknown as Date;
const ufd = undefined as unknown as Date;

describe("DateUtils", () => {
  describe("dateToTimestamp", () => {
    test("对null应该返回0", () => {
      expect(DateUtils.dateToTimestamp(nl)).toBe(0);
    });

    test("对undefined应该返回0", () => {
      expect(DateUtils.dateToTimestamp(ufd)).toBe(0);
    });

    test("对有效日期应该返回正确的时间戳", () => {
      const date = new Date("Tue, 19 Jun 2018 00:00:00 GMT");
      expect(DateUtils.dateToTimestamp(date)).toBe(date.getTime());
    });
  });

  describe("timestampToDate", () => {
    test("对有效时间戳应该返回正确的日期", () => {
      const timestamp = 1529366400000; // 对应 "Tue, 19 Jun 2018 00:00:00 GMT"
      expect(DateUtils.timestampToDate(timestamp).getTime()).toBe(timestamp);
    });
  });

  describe("getToday", () => {
    test("应该返回今天的午夜时间", () => {
      const today = DateUtils.getToday();
      expect(today.getHours()).toBe(0);
      expect(today.getMinutes()).toBe(0);
      expect(today.getSeconds()).toBe(0);
      expect(today.getMilliseconds()).toBe(0);
    });
  });

  describe("toString", () => {
    test("应该正确格式化日期", () => {
      const date = new Date("2023-12-27T12:34:56.789Z");
      const formatted = DateUtils.toString(date, "yyyy-MM-dd HH:mm:ss.SSS");
      expect(formatted).toBe("2023-12-27 20:34:56.789");
    });

    test("应该处理个位数的月份和日期", () => {
      const date = new Date("2023-01-05T12:34:56.789Z");
      const formatted = DateUtils.toString(date, "yyyy-M-d HH:mm");
      expect(formatted).toBe("2023-1-5 20:34");
    });

    test("应该处理个位数的小时", () => {
      const date = new Date("2023-01-05T01:04:06.789Z");
      const formatted = DateUtils.toString(date, "yy-M-d H:m:s.S");
      expect(formatted).toBe("23-1-5 9:4:6.789");
    });
    test("应该处理空日期", () => {
      const date = new Date("");
      const formatted = DateUtils.toString(date, "");
      expect(formatted).toBe("");
    });
  });

  describe("toUTCString", () => {
    test("应该正确格式化UTC日期", () => {
      const date = new Date("2023-12-27T12:34:56.789Z");
      const formatted = DateUtils.toUTCString(date, "yyyy-MM-dd HH:mm:ss.SSS");
      expect(formatted).toBe("2023-12-27 12:34:56.789");
    });

    test("应该处理个位数的月份和日期", () => {
      const date = new Date("2023-01-05T12:34:56.789Z");
      const formatted = DateUtils.toUTCString(date, "yyyy-M-d HH:mm");
      expect(formatted).toBe("2023-1-5 12:34");
    });

    test("应该处理个位数的小时", () => {
      const date = new Date("2023-01-05T01:04:06.789Z");
      const formatted = DateUtils.toUTCString(date, "yy-M-d H:m:s.S");
      expect(formatted).toBe("23-1-5 1:4:6.789");
    });
    test("应该处理空日期", () => {
      const date = new Date("");
      const formatted = DateUtils.toUTCString(date, "");
      expect(formatted).toBe("");
    });
  });

  describe("compare", () => {
    test("当date1小于date2时应该返回-1", () => {
      const date1 = new Date("2023-01-01");
      const date2 = new Date("2023-01-02");
      expect(DateUtils.compare(date1, date2)).toBe(-1);
    });

    test("当date1等于date2时应该返回0", () => {
      const date1 = new Date("2023-01-01");
      const date2 = new Date("2023-01-01");
      expect(DateUtils.compare(date1, date2)).toBe(0);
    });

    test("当date1大于date2时应该返回1", () => {
      const date1 = new Date("2023-01-02");
      const date2 = new Date("2023-01-01");
      expect(DateUtils.compare(date1, date2)).toBe(1);
    });
  });
});
