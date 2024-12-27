import DateUtils from "../utils/date.utils";

const nl = null as unknown as Date;
const ufd = undefined as unknown as Date;

describe("DateUtils", () => {
  describe("dateToTimestamp", () => {
    test("should return 0 for null", () => {
      expect(DateUtils.dateToTimestamp(nl)).toBe(0);
    });

    test("should return 0 for undefined", () => {
      expect(DateUtils.dateToTimestamp(ufd)).toBe(0);
    });

    test("should return correct timestamp for valid date", () => {
      const date = new Date("Tue, 19 Jun 2018 00:00:00 GMT");
      expect(DateUtils.dateToTimestamp(date)).toBe(date.getTime());
    });
  });

  describe("timestampToDate", () => {
    test("should return correct date for valid timestamp", () => {
      const timestamp = 1529366400000; // Corresponds to "Tue, 19 Jun 2018 00:00:00 GMT"
      expect(DateUtils.timestampToDate(timestamp).getTime()).toBe(timestamp);
    });
  });

  describe("getToday", () => {
    test("should return today's date at midnight", () => {
      const today = DateUtils.getToday();
      expect(today.getHours()).toBe(0);
      expect(today.getMinutes()).toBe(0);
      expect(today.getSeconds()).toBe(0);
      expect(today.getMilliseconds()).toBe(0);
    });
  });

  describe("toString", () => {
    test("should format date correctly", () => {
      const date = new Date("2023-12-27T12:34:56.789Z");
      const formatted = DateUtils.toString(date, "yyyy-MM-dd HH:mm:ss.SSS");
      expect(formatted).toBe("2023-12-27 20:34:56.789");
    });

    test("should handle single-digit months and days", () => {
      const date = new Date("2023-01-05T12:34:56.789Z");
      const formatted = DateUtils.toString(date, "yyyy-M-d HH:mm");
      expect(formatted).toBe("2023-1-5 20:34");
    });

    test("should handle single-digit hours", () => {
      const date = new Date("2023-01-05T01:04:06.789Z");
      const formatted = DateUtils.toString(date, "yy-M-d H:m:s.S");
      expect(formatted).toBe("23-1-5 9:4:6.789");
    });
    test("should handle empty dateS", () => {
      const date = new Date("");
      const formatted = DateUtils.toString(date, "");
      expect(formatted).toBe("");
    });
  });

  describe("toUTCString", () => {
    test("should format UTC date correctly", () => {
      const date = new Date("2023-12-27T12:34:56.789Z");
      const formatted = DateUtils.toUTCString(date, "yyyy-MM-dd HH:mm:ss.SSS");
      expect(formatted).toBe("2023-12-27 12:34:56.789");
    });

    test("should handle single-digit months and days", () => {
      const date = new Date("2023-01-05T12:34:56.789Z");
      const formatted = DateUtils.toUTCString(date, "yyyy-M-d HH:mm");
      expect(formatted).toBe("2023-1-5 12:34");
    });

    test("should handle single-digit hours", () => {
      const date = new Date("2023-01-05T01:04:06.789Z");
      const formatted = DateUtils.toUTCString(date, "yy-M-d H:m:s.S");
      expect(formatted).toBe("23-1-5 1:4:6.789");
    });
    test("should handle empty dateS", () => {
      const date = new Date("");
      const formatted = DateUtils.toUTCString(date, "");
      expect(formatted).toBe("");
    });
  });

  describe("compare", () => {
    test("should return -1 if date1 is less than date2", () => {
      const date1 = new Date("2023-01-01");
      const date2 = new Date("2023-01-02");
      expect(DateUtils.compare(date1, date2)).toBe(-1);
    });

    test("should return 0 if date1 is equal to date2", () => {
      const date1 = new Date("2023-01-01");
      const date2 = new Date("2023-01-01");
      expect(DateUtils.compare(date1, date2)).toBe(0);
    });

    test("should return 1 if date1 is greater than date2", () => {
      const date1 = new Date("2023-01-02");
      const date2 = new Date("2023-01-01");
      expect(DateUtils.compare(date1, date2)).toBe(1);
    });
  });
});
