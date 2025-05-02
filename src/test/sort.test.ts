import { SortOrder } from "../utils/enum";
import SortUtils from "../utils/sort.utils";
import { ComparatorThan, SortKey } from "../utils/type";

interface TestItem {
  id: number;
  name: string;
  age: number;
  children?: TestItem[];
}

describe("SortUtils", () => {
  const testData: TestItem[] = [
    { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
    { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
    { id: 3, name: "Charlie", age: 35, children: [] },
    { id: 4, name: "Dave", age: 40 },
  ];

  describe("基础排序功能", () => {
    it("应正确执行升序排序", () => {
      const result = SortUtils.sort(testData, { order: SortOrder.ASC, sortKeys: ["age"] });
      expect(result.map((item) => item.age)).toEqual([25, 30, 35, 40]);
    });

    it("应正确执行降序排序", () => {
      const result = SortUtils.sort(testData, { order: SortOrder.DESC, sortKeys: ["age"] });
      expect(result.map((item) => item.age)).toEqual([40, 35, 30, 25]);
    });

    it("应处理空数组输入", () => {
      const result = SortUtils.sort<TestItem>([]);
      expect(result).toEqual([]);
    });

    it("应保留单元素数组", () => {
      const result = SortUtils.sort([testData[0]]);
      expect(result).toEqual([testData[0]]);
    });
  });

  describe("多字段排序", () => {
    it("应按多个字段排序", () => {
      const result = SortUtils.sort(testData, {
        sortKeys: [{ key: "age", order: SortOrder.DESC }, "name"],
      });
      expect(result[0].name).toBe("Dave"); // 最大年龄
      expect(result[1].name).toBe("Charlie"); // 次大年龄
    });

    it("应处理复杂排序配置", () => {
      const result = SortUtils.sort(testData, {
        sortKeys: [
          { key: "children", order: SortOrder.ASC, transform: (v: any) => (v ? v?.length : 0) },
          { key: "age", order: SortOrder.ASC },
        ],
      });
      expect(result[0].children?.length).toBe(0); // 无子元素的排在前
      expect(result[0].age).toBe(35); // Charlie
    });
  });

  describe("递归子元素排序", () => {
    it("应递归排序子元素", () => {
      const sorted = SortUtils.sort(testData, {
        sortChild: true,
        childField: "children",
        sortKeys: ["age"],
      });
      expect(sorted[1].children?.[0]?.age).toBe(undefined); // 子元素已排序
    });

    it("应处理空子元素数组", () => {
      const sorted = SortUtils.sort(testData, {
        sortChild: true,
        childField: "children",
      });
      expect(sorted[2].children).toEqual([]); // 空数组保持不变
    });
  });

  describe("自定义比较函数", () => {
    it("应应用自定义比较逻辑", () => {
      const compare = (a: TestItem, b: TestItem) => a.name.localeCompare(b.name);
      const result = SortUtils.sort(testData, { compare });
      expect(result[0].name).toBe("Dave"); // 字典序排序
    });

    it("应反转自定义比较结果", () => {
      const compare = (a: TestItem, b: TestItem) => a.name.localeCompare(b.name);
      const result = SortUtils.sort(testData, { compare, order: SortOrder.ASC });
      expect(result[0].name).toBe("Alice"); // 反向排序
    });
  });

  describe("自定义 compare 函数测试", () => {
    it("应应用自定义 compare 函数进行排序", () => {
      // 自定义 compare 函数：按分数降序排序，相同分数按名称升序
      const compareFn = (a: number, b: number): ComparatorThan => {
        if (a > b) return ComparatorThan.LessThan; // 反转比较（降序）
        if (a < b) return ComparatorThan.GreaterThan;
        return ComparatorThan.Equal;
      };

      const sortKey: SortKey<TestItem> = {
        key: "age",
        compare: compareFn,
        order: SortOrder.ASC, // 这里 order 参数会被 compare 函数覆盖
      };

      const result = SortUtils.sort(testData, {
        sortKeys: [sortKey],
      });

      expect(result).toEqual([testData[3], testData[2], testData[0], testData[1]]);
    });
  });

  describe("skipIf 功能测试", () => {
    it("应跳过满足条件的字段比较", () => {
      type TestDataItem = {
        id: number;
        score: number | null;
        name: string;
      };

      const testData: TestDataItem[] = [
        { id: 1, score: 60, name: "Alice" },
        { id: 2, score: 90, name: "Bob" },
        { id: 3, score: 80, name: "Charlie" },
        { id: 4, score: 57, name: "Dave" },
        { id: 5, score: 56, name: "Elk" },
      ];

      // 定义 skipIf 条件：当 score 相等时跳过该字段
      const sortKey: SortKey<TestDataItem> = {
        key: "score",
        skipIf: (value: number) => value < 60,
        order: SortOrder.ASC,
      };

      const result = SortUtils.sort(testData, {
        sortKeys: [sortKey, { key: "id" }],
      });

      // 预期结果：score 为85的项按 name 排序，score 90的排在最前
      expect(result).toEqual([testData[4], testData[3], testData[0], testData[2], testData[1]]);
    });

    it("应处理多个 skipIf 条件", () => {
      type TestDataItem = { id: number; category: string; value: number };

      const testData: TestDataItem[] = [
        { id: 1, category: "A", value: 10 },
        { id: 2, category: "B", value: 20 },
        { id: 3, category: "A", value: 5 },
      ];

      const sortKeys: SortKey<TestDataItem>[] = [
        {
          key: "category",
          skipIf: (category: string) => category === "A",
        },
        { key: "value" },
      ];

      const result = SortUtils.sort(testData, {
        sortKeys,
      });

      // 预期：category=A 的项跳过比较，按 value 排序
      expect(result).toEqual([
        testData[1], // value=5（category=A 被跳过）
        testData[0], // value=10（category=A 被跳过）
        testData[2], // category=B 未被跳过，直接按 value 排序
      ]);
    });
  });
});
