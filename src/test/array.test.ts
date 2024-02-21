import ArrayUtils from "../utils/array.utils";

describe("ArrayUtils", () => {
  describe("isEmpty", () => {
    it("should return true for empty array", () => {
      expect(ArrayUtils.isEmpty([])).toBe(true);
    });
    it("should return true for null", () => {
      expect(ArrayUtils.isEmpty(null)).toBe(true);
    });
    it("should return true for undefined", () => {
      expect(ArrayUtils.isEmpty(undefined)).toBe(true);
    });
    it("should return false for non-empty array", () => {
      expect(ArrayUtils.isEmpty([1])).toBe(false);
    });
  });

  describe("isNotEmpty", () => {
    it("should return false for empty array", () => {
      expect(ArrayUtils.isNotEmpty([])).toBe(false);
    });
    it("should return false for null", () => {
      expect(ArrayUtils.isNotEmpty(null)).toBe(false);
    });
    it("should return false for undefined", () => {
      expect(ArrayUtils.isNotEmpty(undefined)).toBe(false);
    });
    it("should return true for non-empty array", () => {
      expect(ArrayUtils.isNotEmpty([1])).toBe(true);
    });
  });

  describe("take", () => {
    it("should return first item with default", () => {
      expect(ArrayUtils.take([1, 2, 3])).toEqual([1]);
    });
    it("should return n items", () => {
      expect(ArrayUtils.take([1, 2, 3], 2)).toEqual([1, 2]);
    });
    it("should return all if n > length", () => {
      expect(ArrayUtils.take([1, 2, 3], 10)).toEqual([1, 2, 3]);
    });
    it("should return empty if n <= 0", () => {
      expect(ArrayUtils.take([1, 2, 3], 0)).toEqual([]);
    });
  });

  describe("min", () => {
    it("returns the minimum value of a number array", () => {
      expect(ArrayUtils.min([1, 5, 3, 2, 4])).toEqual(1);
    });
    it("returns Infinity for empty array", () => {
      expect(ArrayUtils.min([])).toEqual(Infinity);
    });
    it("handles array with one element", () => {
      expect(ArrayUtils.min([5])).toEqual(5);
    });
    it("handles array with all same numbers", () => {
      expect(ArrayUtils.min([1, 1, 1])).toEqual(1);
    });
    it("returns Number.MIN_VALUE for all negative numbers", () => {
      expect(ArrayUtils.min([-5, -3, -1])).toEqual(-5);
    });
  });
  describe("takeRight", () => {
    it("returns last item with default", () => {
      expect(ArrayUtils.takeRight([1, 2, 3])).toEqual([3]);
    });
    it("returns n items from end", () => {
      expect(ArrayUtils.takeRight([1, 2, 3], 2)).toEqual([2, 3]);
    });
    it("returns all if n > length", () => {
      expect(ArrayUtils.takeRight([1, 2], 10)).toEqual([1, 2]);
    });
    it("returns empty if n <= 0", () => {
      expect(ArrayUtils.takeRight([1, 2], 0)).toEqual([]);
    });
    it("handles null/undefined n", () => {
      expect(ArrayUtils.takeRight([1, 2], null)).toEqual([2]);
    });
    it("handles NaN n", () => {
      expect(ArrayUtils.takeRight([1, 2], NaN)).toEqual([2]);
    });
    it("returns empty for empty array", () => {
      expect(ArrayUtils.takeRight([])).toEqual([]);
    });
  });
  describe("max", () => {
    it("returns the maximum value of a number array", () => {
      expect(ArrayUtils.max([1, 5, 3, 2, 4])).toEqual(5);
    });
    it("returns -Infinity for empty array", () => {
      expect(ArrayUtils.max([])).toBe(-Infinity);
    });
    it("handles array with one element", () => {
      expect(ArrayUtils.max([5])).toEqual(5);
    });
    it("handles array with all same numbers", () => {
      expect(ArrayUtils.max([1, 1, 1])).toEqual(1);
    });

    it("returns Number.MAX_VALUE for all positive numbers", () => {
      expect(ArrayUtils.max([1, 3, 5])).toEqual(5);
    });
  });
  describe("remove", () => {
    let array;
    beforeEach(() => {
      array = [1, 2, 3];
    });
    it("removes item successfully", () => {
      const result = ArrayUtils.remove(array, 2);
      expect(result).toBe(true);
      expect(array).toEqual([1, 3]);
    });
    it("returns false if item not found", () => {
      const result = ArrayUtils.remove(array, 4);
      expect(result).toBe(false);
    });
    it("does not modify original array if failed", () => {
      ArrayUtils.remove(array, 4);
      expect(array).toEqual([1, 2, 3]);
    });
    it("handles removing first item", () => {
      ArrayUtils.remove(array, 1);
      expect(array).toEqual([2, 3]);
    });
    it("handles removing last item", () => {
      ArrayUtils.remove(array, 3);
      expect(array).toEqual([1, 2]);
    });
  });
  describe("insert", () => {
    let array;
    beforeEach(() => {
      array = [1, 2, 3];
    });
    it("inserts item successfully", () => {
      const result = ArrayUtils.insert(array, 1, 4);
      expect(result).toBe(true);
      expect(array).toEqual([1, 4, 2, 3]);
    });
    it("returns false for invalid index", () => {
      expect(ArrayUtils.insert(array, -1, 4)).toBe(true);
    });
    it("handles inserting at beginning", () => {
      ArrayUtils.insert(array, 0, 0);
      expect(array).toEqual([0, 1, 2, 3]);
    });
    it("handles inserting at end", () => {
      ArrayUtils.insert(array, 3, 4);
      expect(array).toEqual([1, 2, 3, 4]);
    });
  });
  describe("containsAny", () => {
    it("returns true if any candidate is found", () => {
      expect(ArrayUtils.containsAny([1, 2, 3], [2, 4])).toBe(true);
    });
    it("returns false if no candidate is found", () => {
      expect(ArrayUtils.containsAny([1, 2, 3], [4, 5, 6])).toBe(false);
    });
    it("returns false for empty array", () => {
      expect(ArrayUtils.containsAny([], [1])).toBe(false);
    });
    it("returns false for empty candidates", () => {
      expect(ArrayUtils.containsAny([1], [])).toBe(false);
    });
    it("returns true for candidate in first position", () => {
      expect(ArrayUtils.containsAny([2, 1, 3], [2])).toBe(true);
    });
    it("returns true for candidate in last position", () => {
      expect(ArrayUtils.containsAny([1, 2, 3], [3])).toBe(true);
    });
  });
  describe("contains", () => {
    it("should return true when the item is present in the array", () => {
      const array = [1, 2, 3, 4, 5];
      const item = 3;
      const result = ArrayUtils.contains(array, item);
      expect(result).toBe(true);
    });
    it("should return false when the item is not present in the array", () => {
      const array = [1, 2, 3, 4, 5];
      const item = 6;
      const result = ArrayUtils.contains(array, item);
      expect(result).toBe(false);
    });
    it("should return false when the array is empty", () => {
      const array: number[] = [];
      const item = 3;
      const result = ArrayUtils.contains(array, item);
      expect(result).toBe(false);
    });
    it("should return false when the item is null or undefined", () => {
      const array = [1, 2, 3, 4, 5];
      const item = null;
      const result = ArrayUtils.contains(array, item);
      expect(result).toBe(false);
    });
  });
});
