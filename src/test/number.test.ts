import NumberUtils from "../utils/number.utils";

describe("NumberUtils", () => {
  describe("isInteger", () => {
    test("对整数应该返回true", () => {
      expect(NumberUtils.isInteger(0)).toBe(true);
      expect(NumberUtils.isInteger(1)).toBe(true);
      expect(NumberUtils.isInteger(-100000)).toBe(true);
      expect(NumberUtils.isInteger(99999999999999999999999)).toBe(true); // 虽然超出安全范围，但仍为整数
    });

    test("对非整数应该返回false", () => {
      expect(NumberUtils.isInteger(0.1)).toBe(false);
      expect(NumberUtils.isInteger(Math.PI)).toBe(false);
      expect(NumberUtils.isInteger(NaN)).toBe(false);
      expect(NumberUtils.isInteger(Infinity)).toBe(false);
      expect(NumberUtils.isInteger(-Infinity)).toBe(false);
      expect(NumberUtils.isInteger("10")).toBe(false);
      expect(NumberUtils.isInteger(true)).toBe(false);
      expect(NumberUtils.isInteger(false)).toBe(false);
      expect(NumberUtils.isInteger([1])).toBe(false);
    });
  });

  describe("isSafeInteger", () => {
    test("对安全整数应该返回true", () => {
      expect(NumberUtils.isSafeInteger(3)).toBe(true);
      expect(NumberUtils.isSafeInteger(Math.pow(2, 53) - 1)).toBe(true);
      expect(NumberUtils.isSafeInteger(3.0)).toBe(true);
    });

    test("对不安全整数和非整数应该返回false", () => {
      expect(NumberUtils.isSafeInteger(Math.pow(2, 53))).toBe(false);
      expect(NumberUtils.isSafeInteger(NaN)).toBe(false);
      expect(NumberUtils.isSafeInteger(Infinity)).toBe(false);
      expect(NumberUtils.isSafeInteger("3")).toBe(false);
      expect(NumberUtils.isSafeInteger(3.1)).toBe(false);
    });
  });

  describe("isNumeric", () => {
    test("对数字应该返回true", () => {
      expect(NumberUtils.isNumeric(123)).toBe(true);
      expect(NumberUtils.isNumeric(0)).toBe(true);
      expect(NumberUtils.isNumeric(-1)).toBe(true);
      expect(NumberUtils.isNumeric(1.5)).toBe(true);
    });

    test("对数字字符串应该返回true", () => {
      expect(NumberUtils.isNumeric("123")).toBe(true);
      expect(NumberUtils.isNumeric("0")).toBe(true);
      expect(NumberUtils.isNumeric("-100")).toBe(true);
      expect(NumberUtils.isNumeric("1.5")).toBe(true);
    });

    test("对非数字字符串应该返回false", () => {
      expect(NumberUtils.isNumeric("abc")).toBe(false);
      expect(NumberUtils.isNumeric("")).toBe(false);
      expect(NumberUtils.isNumeric("  ")).toBe(false);
    });

    test("对NaN和Infinity应该返回false", () => {
      expect(NumberUtils.isNumeric(NaN)).toBe(false);
      expect(NumberUtils.isNumeric(Infinity)).toBe(false);
      expect(NumberUtils.isNumeric(-Infinity)).toBe(false);
    });

    test("对布尔值应该返回false", () => {
      expect(NumberUtils.isNumeric(true)).toBe(false);
      expect(NumberUtils.isNumeric(false)).toBe(false);
    });

    test("对null和undefined应该返回false", () => {
      expect(NumberUtils.isNumeric(null)).toBe(false);
      expect(NumberUtils.isNumeric(undefined)).toBe(false);
    });
  });

  describe("toFixed", () => {
    test("对null应该返回默认值", () => {
      expect(NumberUtils.toFixed(null, 2, "default")).toBe("default");
    });

    test("对undefined应该返回默认值", () => {
      expect(NumberUtils.toFixed(undefined, 2, "default")).toBe("default");
    });

    test("对有效数字应该返回固定小数点表示法", () => {
      expect(NumberUtils.toFixed(1.23456, 2)).toBe("1.23");
      expect(NumberUtils.toFixed(0, 2)).toBe("0.00");
      expect(NumberUtils.toFixed(-1.23456, 3)).toBe("-1.235");
    });

    test("对无效的小数位数应该抛出错误", () => {
      expect(() => NumberUtils.toFixed(1.23456, -1)).toThrow(RangeError);
      expect(() => NumberUtils.toFixed(1.23456, 101)).toThrow(RangeError);
    });
  });
});
