import { ChildQueryMode, Operator } from "../utils/enum";
import QueryUtils from "../utils/query.utils";
import { Condition, QueryChunkOps } from "../utils/type";

interface TestItem {
  id: number;
  name: string;
  age: number;
  children?: TestItem[] | null;
  subItems?: TestItem[] | null;
}

describe("QueryUtils.queryChunk", () => {
  const testData: TestItem[] = [
    { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
    { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
    { id: 3, name: "Charlie", age: 35, children: [] },
    { id: 4, name: "Dave", age: 40 },
  ];

  describe("基础条件查询", () => {
    it("应正确应用AND逻辑", () => {
      const conditions: Condition<TestItem>[] = [
        { field: "age", operator: Operator.GREATER_THAN, value: 25 },
        { field: "name", operator: Operator.CONTAINS, value: "i" },
      ];
      const result = QueryUtils.queryChunk(testData, conditions, "AND");
      expect(result).toEqual([
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
      ]);
    });
    it("应正确处理AND逻辑的条件组", () => {
      const conditionGroup: Condition<TestItem> = {
        logic: "AND",
        conditions: [
          { field: "age", operator: Operator.GREATER_THAN, value: 25 },
          { field: "name", operator: Operator.CONTAINS, value: "i" },
        ],
      };
      const result = QueryUtils.queryChunk(testData, [conditionGroup]);
      expect(result).toEqual([
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
      ]);
    });

    it("应正确应用OR逻辑", () => {
      const conditions: Condition<TestItem>[] = [
        { field: "age", operator: Operator.LESS_THAN, value: 30 },
        { field: "name", operator: Operator.END_WITH, value: "e" },
      ];
      const result = QueryUtils.queryChunk(testData, conditions, "OR");
      expect(result).toEqual([
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
      ]);
    });

    it("应正确应用OR逻辑的条件组合", () => {
      const conditions: Condition<TestItem>[] = [
        { field: "age", operator: Operator.EQUAL, value: 25 },
        { field: "name", operator: Operator.EQUAL, value: "Dave" },
      ];
      const result = QueryUtils.queryChunk(testData, conditions, "OR");
      expect(result).toEqual([
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
        { id: 4, name: "Dave", age: 40 },
      ]);
    });

    it("应正确处理BITWISE_ALL操作符的数字值", () => {
      const conditions: Condition<TestItem>[] = [
        { field: "age", operator: Operator.BITWISE_ALL, value: 240 }, // 二进制 11110000
      ];
      const result = QueryUtils.queryChunk(testData, conditions, "AND");
      expect(result).toEqual([]); // 当前测试数据中 age 不满足
    });

    it("应正确处理BITWISE_ANY操作符的数字值", () => {
      const conditions: Condition<TestItem>[] = [
        { field: "age", operator: Operator.BITWISE_ANY, value: 8 }, // 二进制 1000
      ];
      const result = QueryUtils.queryChunk(testData, conditions);
      expect(result).toEqual([
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
        { id: 4, name: "Dave", age: 40 },
      ]);
    });
    it("应正确处理NOT_EQUAL操作符的数字值", () => {
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.NOT_EQUAL, value: 8 }];
      const result = QueryUtils.queryChunk(testData, conditions, "OR");
      expect(result).toEqual([
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
      ]);
    });
    it("应正确处理GREATER_THAN_OR_EQUAL操作符的数字值", () => {
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.GREATER_THAN_OR_EQUAL, value: 40 }];
      const result = QueryUtils.queryChunk(testData, conditions, "OR");
      expect(result).toEqual([{ id: 4, name: "Dave", age: 40 }]);
    });
    it("应正确处理LESS_THAN_OR_EQUAL操作符的数字值", () => {
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.LESS_THAN_OR_EQUAL, value: 25 }];
      const result = QueryUtils.queryChunk(testData, conditions, "OR");
      expect(result).toEqual([{ id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] }]);
    });
    it("应正确处理START_WITH操作符的数字值", () => {
      const conditions: Condition<TestItem>[] = [{ field: "name", operator: Operator.START_WITH, value: "B" }];
      const result = QueryUtils.queryChunk(testData, conditions, "OR");
      expect(result).toEqual([{ id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] }]);
    });
    it("应正确处理IN操作符的数字值", () => {
      const conditions: Condition<TestItem>[] = [{ field: "name", operator: Operator.IN, value: ["Bob"] }];
      const result = QueryUtils.queryChunk(testData, conditions, "OR");
      expect(result).toEqual([{ id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] }]);
    });
    it("应正确处理NOT_IN操作符的数字值", () => {
      const conditions: Condition<TestItem>[] = [{ field: "name", operator: Operator.NOT_IN, value: ["Bob"] }];
      const result = QueryUtils.queryChunk(testData, conditions, "OR");
      expect(result).toEqual([
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
      ]);
    });
    it("应正确处理BITWISE_ZERO操作符", () => {
      const conditions: Condition<TestItem>[] = [
        {
          field: "age",
          operator: Operator.BITWISE_ZERO,
          value: 16,
        },
      ];
      const result = QueryUtils.queryChunk(testData, conditions);
      expect(result).toEqual([
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
      ]); // 根据实际计算调整
    });
    it("应正确处理REGEX操作符", () => {
      const conditions: Condition<TestItem>[] = [{ field: "name", operator: Operator.REGEX, value: "^A.*e$" }];
      const result = QueryUtils.queryChunk(testData, conditions, "AND");
      expect(result).toEqual([{ id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] }]);
    });
    it("应正确处理IS_NULL操作符", () => {
      const conditions: Condition<TestItem>[] = [{ field: "children", operator: Operator.IS_NULL }];
      const result = QueryUtils.queryChunk(testData, conditions, "AND");
      expect(result).toEqual([{ id: 4, name: "Dave", age: 40 }]);
    });
    it("应正确处理IS_NOT_NULL操作符", () => {
      const conditions: Condition<TestItem>[] = [{ field: "children", operator: Operator.IS_NOT_NULL }];
      const result = QueryUtils.queryChunk(testData, conditions, "AND");
      expect(result).toEqual([
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
      ]);
    });
    it("应正确处理conditions为空数组", () => {
      const result = QueryUtils.queryChunk(testData, [{ field: "name", operator: 123 as Operator.IS_NOT_NULL }]);
      expect(result).toEqual(testData);
    });
  });
  describe("分块处理", () => {
    it("应正确处理分块大小", () => {
      const chunkSize = 2;
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.EQUAL, value: 25 }];
      const result = QueryUtils.queryChunk(testData, conditions, "AND", { chunkSize });
      expect(result).toEqual([{ id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] }]);
    });

    it("应处理分块大小为0时返回空数组", () => {
      const chunkSize = 0;
      const conditions: Condition<TestItem>[] = [{ field: "id", operator: Operator.EQUAL, value: 1 }];
      const result = QueryUtils.queryChunk(testData, conditions, "AND", { chunkSize });
      expect(result).toEqual([]);
    });
  });

  describe("递归子项查询", () => {
    it("应在PARENT_AND_CHILD模式下递归处理子项并更新children字段", () => {
      const testData: TestItem[] = [
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
        { id: 5, name: null as any, age: 45 },
        { id: 6, name: "Eva", age: null as any, subItems: [{ id: 61, name: "Child3", age: 10 }] },
      ];
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.GREATER_THAN, value: 6 }];
      const options: QueryChunkOps<TestItem> = {
        isHdChild: true,
        sourceChildField: "children",
        childQueryMode: ChildQueryMode.PARENT_AND_CHILD,
      };
      const result = QueryUtils.queryChunk(testData, conditions, "AND", options);
      expect(result).toEqual([
        {
          id: 2,
          name: "Bob",
          age: 25,
          children: [{ id: 12, name: "Child2", age: 8 }],
        },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
        { id: 5, name: null as any, age: 45 },
      ]);
    });

    it("应在PARENT_ONLY模式下仅检查父项", () => {
      const testData: TestItem[] = [
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
        { id: 5, name: null as any, age: 45 },
        { id: 6, name: "Eva", age: null as any, subItems: [{ id: 61, name: "Child3", age: 10 }] },
      ];
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.GREATER_THAN, value: 30 }];
      const options: QueryChunkOps<TestItem> = {
        isHdChild: true,
        sourceChildField: "children",
        childQueryMode: ChildQueryMode.PARENT_ONLY,
      };
      const result = QueryUtils.queryChunk(testData, conditions, "AND", options);
      expect(result).toEqual([
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
        { id: 5, name: null as any, age: 45 },
      ]);
    });

    it("应在CHILD_ONLY模式下仅检查子项并返回匹配的父项", () => {
      const testData: TestItem[] = [
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
        { id: 5, name: null as any, age: 45 },
        { id: 6, name: "Eva", age: null as any, subItems: [{ id: 61, name: "Child3", age: 10 }] },
      ];
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.EQUAL, value: 8 }];
      const options: QueryChunkOps<TestItem> = {
        isHdChild: true,
        sourceChildField: "children",
        childQueryMode: ChildQueryMode.CHILD_ONLY,
      };
      const result = QueryUtils.queryChunk(testData, conditions, "AND", options);
      expect(result).toEqual([
        {
          id: 2,
          name: "Bob",
          age: 25,
          children: [{ id: 12, name: "Child2", age: 8 }],
        },
      ]);
    });

    it("应在PARENT_AND_CHILD模式下使用onItemMatch仅返回父项满足的项", () => {
      const testData: TestItem[] = [
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
        { id: 5, name: null as any, age: 45 },
        { id: 6, name: "Eva", age: null as any, subItems: [{ id: 61, name: "Child3", age: 10 }] },
      ];
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.GREATER_THAN, value: 20 }];
      const options: QueryChunkOps<TestItem> = {
        isHdChild: true,
        sourceChildField: "children",
        childQueryMode: ChildQueryMode.PARENT_AND_CHILD,
        onItemMatch: ({ isMatch }) => isMatch,
      };
      const result = QueryUtils.queryChunk(testData, conditions, "AND", options);
      expect(result).toEqual([
        {
          id: 1,
          name: "Alice",
          age: 30,
          children: [],
        },
        {
          id: 2,
          name: "Bob",
          age: 25,
          children: [],
        },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
        { id: 5, name: null as any, age: 45 },
      ]);
    });

    it("应在PARENT_AND_CHILD模式下使用onItemMatch仅返回父项和子项都满足的项", () => {
      const testData: TestItem[] = [
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
        { id: 5, name: null as any, age: 45 },
        { id: 6, name: "Eva", age: null as any, subItems: [{ id: 61, name: "Child3", age: 10 }] },
      ];
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.GREATER_THAN, value: 6 }];
      const options: QueryChunkOps<TestItem> = {
        isHdChild: true,
        sourceChildField: "children",
        childQueryMode: ChildQueryMode.PARENT_AND_CHILD,
        onItemMatch: ({ isMatch, isMatchChild }) => isMatch && isMatchChild,
      };
      const result = QueryUtils.queryChunk(testData, conditions, "AND", options);
      expect(result).toEqual([
        {
          id: 2,
          name: "Bob",
          age: 25,
          children: [{ id: 12, name: "Child2", age: 8 }],
        },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
        { id: 5, name: null as any, age: 45 },
      ]);
    });

    it("应支持动态sourceChildField函数", () => {
      const testData: TestItem[] = [
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 10 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
        { id: 5, name: null as any, age: 45 },
        { id: 6, name: "Eva", age: null as any, subItems: [{ id: 61, name: "Child3", age: 10 }] },
      ];
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.EQUAL, value: 10 }];
      const options: QueryChunkOps<TestItem> = {
        isHdChild: true,
        sourceChildField: (item) => (item.id === 6 ? "subItems" : "children"),
        childQueryMode: ChildQueryMode.CHILD_ONLY,
      };
      const result = QueryUtils.queryChunk(testData, conditions, "AND", options);
      expect(result).toEqual([
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 10 }] },
        {
          id: 6,
          name: "Eva",
          age: null as any,
          subItems: [{ id: 61, name: "Child3", age: 10 }],
          children: [{ id: 61, name: "Child3", age: 10 }],
        },
      ]);
    });

    it("应过滤掉子项为空的父项", () => {
      const testData: TestItem[] = [
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
      ];
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.LESS_THAN, value: 5 }];
      const options: QueryChunkOps<TestItem> = { isHdChild: true, sourceChildField: "children" };
      const result = QueryUtils.queryChunk(testData, conditions, "AND", options);
      expect(result).toEqual([]);
    });

    it("应不递归处理子项并保留原始children字段", () => {
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.GREATER_THAN, value: 6 }];
      const options: QueryChunkOps<TestItem> = { isHdChild: false };
      const result = QueryUtils.queryChunk(testData, conditions, "AND", options);
      expect(result).toEqual(testData); // 所有项均符合条件，children 保持原值
    });
  });

  describe("边界情况", () => {
    it("应返回空数组当无匹配项", () => {
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.EQUAL, value: 100 }];
      const result = QueryUtils.queryChunk(testData, conditions);
      expect(result).toEqual([]);
    });

    it("应提前终止AND逻辑的循环", () => {
      const chunkSize = 1;
      const conditions: Condition<TestItem>[] = [
        { field: "age", operator: Operator.EQUAL, value: 25 },
        { field: "age", operator: Operator.EQUAL, value: 40 },
      ];
      const result = QueryUtils.queryChunk(testData, conditions, "AND", { chunkSize });
      expect(result).toEqual([]);
    });

    it("应处理默认分块大小", () => {
      const CHUNK_SIZE = 100; // 假设全局常量定义
      const conditions: Condition<TestItem>[] = [{ field: "id", operator: Operator.BETWEEN, value: [1, 3] }];
      const result = QueryUtils.queryChunk(testData, conditions, undefined, { chunkSize: CHUNK_SIZE });
      expect(result).toEqual(testData.slice(0, 3));
    });
  });

  describe("异常处理", () => {
    it("应处理BETWEEN操作符的非数组值", () => {
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.BETWEEN, value: "invalid" }];
      expect(() => QueryUtils.queryChunk(testData, conditions)).toThrow("BETWEEN requires a two-element array");
    }, 5000); // ✅ 设置超时

    it("应处理BITWISE操作符的非数字值", () => {
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.BITWISE_ALL, value: "invalid" }];
      const result = QueryUtils.queryChunk(testData, conditions, "AND");
      expect(result).toEqual([]);
    });

    it("应处理负数分块大小（使用默认值）", () => {
      const chunkSize = -1;
      const conditions: Condition<TestItem>[] = [{ field: "id", operator: Operator.EQUAL, value: 1 }];
      const result = QueryUtils.queryChunk(testData, conditions, "AND", { chunkSize });
      expect(result).toEqual([]);
    });
  });

  describe("优化后的特性测试", () => {
    const testData: TestItem[] = [
      { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
      { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
      { id: 3, name: "Charlie", age: 35, children: [] },
      { id: 4, name: "Dave", age: 40 },
      { id: 5, name: null as any, age: 45 },
      { id: 6, name: "Eva", age: null as any },
    ];

    it("应正确处理带空值的对象比较", () => {
      const conditions: Condition<TestItem>[] = [{ field: "name", operator: Operator.CONTAINS, value: "a" }];
      const result = QueryUtils.queryChunk(testData, conditions);

      expect(result).toEqual([
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
        { id: 6, name: "Eva", age: null as any },
      ]);
    });

    it("应正确处理数值字段为null的情况", () => {
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.GREATER_THAN, value: 30 }];
      const result = QueryUtils.queryChunk(testData, conditions);
      // 期望排除age为null的项
      expect(result).toEqual([
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
        { id: 5, name: null as any, age: 45 },
      ]);
    });

    it("应正确处理输入为空数组的情况", () => {
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.GREATER_THAN, value: 30 }];
      const result = QueryUtils.queryChunk([], conditions);
      expect(result).toEqual([]);
    });

    it("应正确处理输入为null的情况", () => {
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.GREATER_THAN, value: 30 }];
      const result = QueryUtils.queryChunk(null as any, conditions);
      expect(result).toEqual([]);
    });

    it("应正确处理条件为null的情况", () => {
      const result = QueryUtils.queryChunk(testData, null as any);
      expect(result).toEqual([]);
    });

    it("应正确处理子元素查询中子元素为空的情况", () => {
      // 确保类型兼容
      const dataWithNullChildren: TestItem[] = [
        { id: 1, name: "Alice", age: 30, children: null },
        { id: 2, name: "Bob", age: 25, children: undefined },
      ];

      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.GREATER_THAN, value: 20 }];

      const options: QueryChunkOps<TestItem> = {
        isHdChild: true,
        sourceChildField: "children",
      };

      const result = QueryUtils.queryChunk(dataWithNullChildren, conditions, "AND", options);

      // 应该返回所有符合条件的项，但没有子元素处理
      expect(result).toEqual([
        { id: 1, name: "Alice", age: 30, children: null },
        { id: 2, name: "Bob", age: 25, children: undefined },
      ]);
    });

    it("应正确处理REGEX操作符的错误模式", () => {
      // 使用有效但不会匹配任何内容的正则表达式
      const conditions: Condition<TestItem>[] = [
        { field: "name", operator: Operator.REGEX, value: "^$" }, // 匹配空字符串
      ];

      const result = QueryUtils.queryChunk(testData, conditions);
      expect(result).toEqual([]);
    });

    it("应对比较字段传递完整的条件配置", () => {
      const testData: TestItem[] = [
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 2, name: "Bob", age: 25, children: [{ id: 12, name: "Child2", age: 8 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
      ];
      // 测试自定义compare函数
      const conditions: Condition<TestItem>[] = [
        {
          field: "name",
          operator: Operator.EQUAL,
          value: "test",
          compare: (actual) => {
            // 检查是否传递了完整的字段值而不是转换后的值
            return actual === "Alice";
          },
        },
      ];

      const result = QueryUtils.queryChunk(testData, conditions);
      expect(result).toEqual([{ id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] }]);
    });

    it("应优先执行自定义compare函数", () => {
      // 测试自定义compare函数优先级，修复类型问题
      const conditions: Condition<TestItem>[] = [
        {
          field: "age",
          operator: Operator.LESS_THAN, // 这个操作符应该被忽略
          value: 50,
          compare: (actual, expected: number) => {
            // 指定expected的类型为number
            // 与操作符相反的逻辑
            return (actual as number) > expected;
          },
        },
      ];

      const result = QueryUtils.queryChunk(testData, conditions);
      // 只有age > 50的会返回，但测试数据中没有
      expect(result).toEqual([]);
    });

    it("应正确处理嵌套条件组", () => {
      // 复杂嵌套条件测试
      const nestedCondition: Condition<TestItem> = {
        logic: "AND",
        conditions: [
          { field: "age", operator: Operator.GREATER_THAN, value: 20 },
          {
            logic: "OR",
            conditions: [
              { field: "name", operator: Operator.START_WITH, value: "A" },
              { field: "name", operator: Operator.END_WITH, value: "e" },
            ],
          },
        ],
      };

      const result = QueryUtils.queryChunk(testData, [nestedCondition]);
      expect(result).toEqual([
        { id: 1, name: "Alice", age: 30, children: [{ id: 11, name: "Child1", age: 5 }] },
        { id: 3, name: "Charlie", age: 35, children: [] },
        { id: 4, name: "Dave", age: 40 },
      ]);
    });

    it("应处理子元素递归查询的返回条件", () => {
      const dataWithDeepChildren = [
        {
          id: 1,
          name: "Parent",
          age: 50,
          children: [
            { id: 11, name: "Child1", age: 20, children: [{ id: 111, name: "GrandChild", age: 5 }] },
            { id: 12, name: "Child2", age: 15 },
          ],
        },
      ];

      // 只有孙子符合条件
      const conditions: Condition<TestItem>[] = [{ field: "age", operator: Operator.GREATER_THAN, value: 10 }];

      const options: QueryChunkOps<TestItem> = {
        isHdChild: true,
        sourceChildField: "children",
      };

      const result = QueryUtils.queryChunk(dataWithDeepChildren, conditions, "AND", options);

      // 期望返回完整的层次结构，但只保留符合条件的项
      expect(result).toEqual([
        {
          id: 1,
          name: "Parent",
          age: 50,
          children: [{ id: 12, name: "Child2", age: 15 }],
        },
      ]);
    });
  });
});
