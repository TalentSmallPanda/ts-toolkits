import ArrayUtils from "../utils/array.utils";

describe("ArrayUtils", () => {
  describe("isEmpty", () => {
    it("对空数组应该返回true", () => {
      expect(ArrayUtils.isEmpty([])).toBe(true);
    });
    it("对null应该返回true", () => {
      expect(ArrayUtils.isEmpty(null)).toBe(true);
    });
    it("对undefined应该返回true", () => {
      expect(ArrayUtils.isEmpty(undefined)).toBe(true);
    });
    it("对非空数组应该返回false", () => {
      expect(ArrayUtils.isEmpty([1])).toBe(false);
    });
  });

  describe("isNotEmpty", () => {
    it("对空数组应该返回false", () => {
      expect(ArrayUtils.isNotEmpty([])).toBe(false);
    });
    it("对null应该返回false", () => {
      expect(ArrayUtils.isNotEmpty(null)).toBe(false);
    });
    it("对undefined应该返回false", () => {
      expect(ArrayUtils.isNotEmpty(undefined)).toBe(false);
    });
    it("对非空数组应该返回true", () => {
      expect(ArrayUtils.isNotEmpty([1])).toBe(true);
    });
  });

  describe("take", () => {
    it("使用默认值应该返回第一个元素", () => {
      expect(ArrayUtils.take([1, 2, 3])).toEqual([1]);
    });
    it("应该返回n个元素", () => {
      expect(ArrayUtils.take([1, 2, 3], 2)).toEqual([1, 2]);
    });
    it("如果n大于长度应该返回全部", () => {
      expect(ArrayUtils.take([1, 2, 3], 10)).toEqual([1, 2, 3]);
    });
    it("如果n小于等于0应该返回空数组", () => {
      expect(ArrayUtils.take([1, 2, 3], 0)).toEqual([]);
    });
  });

  describe("min", () => {
    it("返回数字数组的最小值", () => {
      expect(ArrayUtils.min([1, 5, 3, 2, 4])).toEqual(1);
    });
    it("对空数组返回Infinity", () => {
      expect(ArrayUtils.min([])).toEqual(Infinity);
    });
    it("处理只有一个元素的数组", () => {
      expect(ArrayUtils.min([5])).toEqual(5);
    });
    it("处理所有数字相同的数组", () => {
      expect(ArrayUtils.min([1, 1, 1])).toEqual(1);
    });
    it("对所有负数返回最小值", () => {
      expect(ArrayUtils.min([-5, -3, -1])).toEqual(-5);
    });
  });
  describe("takeRight", () => {
    it("使用默认值应该返回最后一个元素", () => {
      expect(ArrayUtils.takeRight([1, 2, 3])).toEqual([3]);
    });
    it("应该从末尾返回n个元素", () => {
      expect(ArrayUtils.takeRight([1, 2, 3], 2)).toEqual([2, 3]);
    });
    it("如果n大于长度应该返回全部", () => {
      expect(ArrayUtils.takeRight([1, 2], 10)).toEqual([1, 2]);
    });
    it("如果n小于等于0应该返回空数组", () => {
      expect(ArrayUtils.takeRight([1, 2], 0)).toEqual([]);
    });
    it("处理null/undefined的n值", () => {
      expect(ArrayUtils.takeRight([1, 2], null)).toEqual([2]);
    });
    it("处理NaN的n值", () => {
      expect(ArrayUtils.takeRight([1, 2], NaN)).toEqual([2]);
    });
    it("对空数组返回空数组", () => {
      expect(ArrayUtils.takeRight([])).toEqual([]);
    });
  });
  describe("max", () => {
    it("返回数字数组的最大值", () => {
      expect(ArrayUtils.max([1, 5, 3, 2, 4])).toEqual(5);
    });
    it("对空数组返回-Infinity", () => {
      expect(ArrayUtils.max([])).toBe(-Infinity);
    });
    it("处理只有一个元素的数组", () => {
      expect(ArrayUtils.max([5])).toEqual(5);
    });
    it("处理所有数字相同的数组", () => {
      expect(ArrayUtils.max([1, 1, 1])).toEqual(1);
    });

    it("对所有正数返回最大值", () => {
      expect(ArrayUtils.max([1, 3, 5])).toEqual(5);
    });
  });
  describe("remove", () => {
    let array;
    beforeEach(() => {
      array = [1, 2, 3];
    });
    it("成功移除元素", () => {
      const result = ArrayUtils.remove(array, 2);
      expect(result).toBe(true);
      expect(array).toEqual([1, 3]);
    });
    it("如果元素未找到返回false", () => {
      const result = ArrayUtils.remove(array, 4);
      expect(result).toBe(false);
    });
    it("如果失败不修改原数组", () => {
      ArrayUtils.remove(array, 4);
      expect(array).toEqual([1, 2, 3]);
    });
    it("处理移除第一个元素", () => {
      ArrayUtils.remove(array, 1);
      expect(array).toEqual([2, 3]);
    });
    it("处理移除最后一个元素", () => {
      ArrayUtils.remove(array, 3);
      expect(array).toEqual([1, 2]);
    });
  });
  describe("insert", () => {
    let array;
    beforeEach(() => {
      array = [1, 2, 3];
    });
    it("成功插入元素", () => {
      const result = ArrayUtils.insert(array, 1, 4);
      expect(result).toBe(true);
      expect(array).toEqual([1, 4, 2, 3]);
    });
    it("对无效索引返回false", () => {
      expect(ArrayUtils.insert(array, -1, 4)).toBe(true);
    });
    it("处理在开头插入", () => {
      ArrayUtils.insert(array, 0, 0);
      expect(array).toEqual([0, 1, 2, 3]);
    });
    it("处理在末尾插入", () => {
      ArrayUtils.insert(array, 3, 4);
      expect(array).toEqual([1, 2, 3, 4]);
    });
  });
  describe("containsAny", () => {
    it("如果找到任何候选项则返回true", () => {
      expect(ArrayUtils.containsAny([1, 2, 3], [2, 4])).toBe(true);
    });
    it("如果没有找到候选项则返回false", () => {
      expect(ArrayUtils.containsAny([1, 2, 3], [4, 5, 6])).toBe(false);
    });
    it("对空数组返回false", () => {
      expect(ArrayUtils.containsAny([], [1])).toBe(false);
    });
    it("对空候选项返回false", () => {
      expect(ArrayUtils.containsAny([1], [])).toBe(false);
    });
    it("对第一个位置的候选项返回true", () => {
      expect(ArrayUtils.containsAny([2, 1, 3], [2])).toBe(true);
    });
    it("对最后一个位置的候选项返回true", () => {
      expect(ArrayUtils.containsAny([1, 2, 3], [3])).toBe(true);
    });
  });
  describe("contains", () => {
    it("当数组中存在该元素时应返回true", () => {
      const array = [1, 2, 3, 4, 5];
      const item = 3;
      const result = ArrayUtils.contains(array, item);
      expect(result).toBe(true);
    });
    it("当数组中不存在该元素时应返回false", () => {
      const array = [1, 2, 3, 4, 5];
      const item = 6;
      const result = ArrayUtils.contains(array, item);
      expect(result).toBe(false);
    });
    it("当数组为空时应返回false", () => {
      const array: number[] = [];
      const item = 3;
      const result = ArrayUtils.contains(array, item);
      expect(result).toBe(false);
    });
    it("当元素为null或undefined时应返回false", () => {
      const array = [1, 2, 3, 4, 5];
      const item = null;
      const result = ArrayUtils.contains(array, item);
      expect(result).toBe(false);
    });
  });
});
