import NumberUtils from "../utils/number.utils";

describe("NumberUtils", () => {
  describe("isInteger", () => {
    test("should return true for integers", () => {
      expect(NumberUtils.isInteger(0)).toBe(true);
      expect(NumberUtils.isInteger(1)).toBe(true);
      expect(NumberUtils.isInteger(-100000)).toBe(true);
      expect(NumberUtils.isInteger(99999999999999999999999)).toBe(true); // 虽然超出安全范围，但仍为整数
    });

    test("should return false for non-integers", () => {
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
    test("should return true for safe integers", () => {
      expect(NumberUtils.isSafeInteger(3)).toBe(true);
      expect(NumberUtils.isSafeInteger(Math.pow(2, 53) - 1)).toBe(true);
      expect(NumberUtils.isSafeInteger(3.0)).toBe(true);
    });

    test("should return false for unsafe integers and non-integers", () => {
      expect(NumberUtils.isSafeInteger(Math.pow(2, 53))).toBe(false);
      expect(NumberUtils.isSafeInteger(NaN)).toBe(false);
      expect(NumberUtils.isSafeInteger(Infinity)).toBe(false);
      expect(NumberUtils.isSafeInteger("3")).toBe(false);
      expect(NumberUtils.isSafeInteger(3.1)).toBe(false);
    });
  });

  describe("toFixed", () => {
    test("should return default value for null", () => {
      expect(NumberUtils.toFixed(null, 2, "default")).toBe("default");
    });

    test("should return default value for undefined", () => {
      expect(NumberUtils.toFixed(undefined, 2, "default")).toBe("default");
    });

    test("should return fixed-point notation for valid numbers", () => {
      expect(NumberUtils.toFixed(1.23456, 2)).toBe("1.23");
      expect(NumberUtils.toFixed(0, 2)).toBe("0.00");
      expect(NumberUtils.toFixed(-1.23456, 3)).toBe("-1.235");
    });

    test("should throw an error for invalid fractionDigits", () => {
      expect(() => NumberUtils.toFixed(1.23456, -1)).toThrow(RangeError);
      expect(() => NumberUtils.toFixed(1.23456, 101)).toThrow(RangeError);
    });
  });
});
