import StringUtils from "../utils/string.utils";

const nullStr = null as unknown as string;
const nullStr1 = null as unknown as string;
const ufdStr = undefined as unknown as string;

describe("StringUtils", () => {
  // 1. isEmpty 测试
  describe("isEmpty", () => {
    test("对null应该返回true", () => {
      expect(StringUtils.isEmpty(null)).toBe(true);
    });
    test("对undefined应该返回true", () => {
      expect(StringUtils.isEmpty(undefined)).toBe(true);
    });
    test("对空字符串应该返回true", () => {
      expect(StringUtils.isEmpty("")).toBe(true);
    });
    test("对非空字符串应该返回false", () => {
      expect(StringUtils.isEmpty("bob")).toBe(false);
    });
    test("对包含空格的字符串应该返回false", () => {
      expect(StringUtils.isEmpty(" ")).toBe(false);
    });
  });

  // 2. isNotEmpty 测试
  describe("isNotEmpty", () => {
    test("对null应该返回false", () => {
      expect(StringUtils.isNotEmpty(null)).toBe(false);
    });
    test("对undefined应该返回false", () => {
      expect(StringUtils.isNotEmpty(undefined)).toBe(false);
    });
    test("对空字符串应该返回false", () => {
      expect(StringUtils.isNotEmpty("")).toBe(false);
    });
    test("对非空字符串应该返回true", () => {
      expect(StringUtils.isNotEmpty("bob")).toBe(true);
    });
  });

  // 3. isBlank 测试
  describe("isBlank", () => {
    test("对null应该返回true", () => {
      expect(StringUtils.isBlank(null)).toBe(true);
    });
    test("对undefined应该返回true", () => {
      expect(StringUtils.isBlank(undefined)).toBe(true);
    });
    test("对空字符串应该返回true", () => {
      expect(StringUtils.isBlank("")).toBe(true);
    });
    test("对包含空格的字符串应该返回true", () => {
      expect(StringUtils.isBlank(" ")).toBe(true);
    });
    test("对非空白字符串应该返回false", () => {
      expect(StringUtils.isBlank("bob")).toBe(false);
    });
  });

  // 4. trim 测试
  describe("trim", () => {
    test("对null应该返回null", () => {
      expect(StringUtils.trim(nullStr)).toBe(null);
    });
    test("对undefined应该返回undefined", () => {
      expect(StringUtils.trim(ufdStr)).toBe(undefined);
    });
    test("对空字符串应该返回空字符串", () => {
      expect(StringUtils.trim("")).toBe("");
    });
    test("应该去除空白字符", () => {
      expect(StringUtils.trim("  a  ")).toBe("a");
    });
  });

  // 5. trimToNull 测试
  describe("trimToNull", () => {
    test("对null应该返回null", () => {
      expect(StringUtils.trimToNull(nullStr)).toBe(null);
    });
    test("对undefined应该返回null", () => {
      expect(StringUtils.trimToNull(ufdStr)).toBe(null);
    });
    test("对空字符串应该返回null", () => {
      expect(StringUtils.trimToNull("")).toBe(null);
    });
    test("对空白字符串应该返回null", () => {
      expect(StringUtils.trimToNull("    ")).toBe(null);
    });
    test("应该去除空白并返回非空字符串", () => {
      expect(StringUtils.trimToNull("  a  ")).toBe("a");
    });
  });

  // 6. trimToEmpty 测试
  describe("trimToEmpty", () => {
    test("对null应该返回空字符串", () => {
      expect(StringUtils.trimToEmpty(nullStr)).toBe("");
    });
    test("对undefined应该返回空字符串", () => {
      expect(StringUtils.trimToEmpty(ufdStr)).toBe("");
    });
    test("对空字符串应该返回空字符串", () => {
      expect(StringUtils.trimToEmpty("")).toBe("");
    });
    test("对空白字符串应该返回空字符串", () => {
      expect(StringUtils.trimToEmpty("    ")).toBe("");
    });
    test("应该去除空白并返回非空字符串", () => {
      expect(StringUtils.trimToEmpty("  a  ")).toBe("a");
    });
  });

  // 7. strip 测试
  describe("strip", () => {
    test("对null应该返回null", () => {
      expect(StringUtils.strip(null)).toBe(null);
    });
    test("对空字符串应该返回空字符串", () => {
      expect(StringUtils.strip("")).toBe("");
    });
    test("应该去除空白字符", () => {
      expect(StringUtils.strip("  a  ")).toBe("a");
    });
    test("应该去除指定字符", () => {
      expect(StringUtils.strip("xyzabcxyz", "xyz")).toBe("abc");
    });
  });

  // 8. equals 测试
  describe("equals", () => {
    test("对null和null应该返回true", () => {
      expect(StringUtils.equals(nullStr, nullStr1)).toBe(true);
    });
    test("对null和非null应该返回false", () => {
      expect(StringUtils.equals(nullStr, "abc")).toBe(false);
    });
    test("对不同字符串应该返回false", () => {
      expect(StringUtils.equals("abc", "def")).toBe(false);
    });
    test("对相同字符串应该返回true", () => {
      expect(StringUtils.equals("abc", "abc")).toBe(true);
    });
    test("对大小写不同的字符串应该返回false", () => {
      expect(StringUtils.equals("abc", "ABC")).toBe(false);
    });
  });

  // 9. equalsIgnoreCase 测试
  describe("equalsIgnoreCase", () => {
    test("对null和null应该返回true", () => {
      expect(StringUtils.equalsIgnoreCase(nullStr, nullStr1)).toBe(true);
    });
    test("对null和非null应该返回false", () => {
      expect(StringUtils.equalsIgnoreCase(nullStr, "abc")).toBe(false);
    });
    test("对不同字符串应该返回false", () => {
      expect(StringUtils.equalsIgnoreCase("abc", "def")).toBe(false);
    });
    test("对相同字符串应该返回true", () => {
      expect(StringUtils.equalsIgnoreCase("abc", "abc")).toBe(true);
    });
    test("对大小写不同的字符串应该返回true", () => {
      expect(StringUtils.equalsIgnoreCase("abc", "ABC")).toBe(true);
    });
  });

  // 10. indexOf 测试
  describe("indexOf", () => {
    test("对null字符串应该返回-1", () => {
      expect(StringUtils.indexOf(nullStr, "a")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
    test("对undefined字符串应该返回-1", () => {
      expect(StringUtils.indexOf(ufdStr, "a")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
    test("对空字符串应该返回-1", () => {
      expect(StringUtils.indexOf("", "a")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
    test("应该找到字符的索引", () => {
      expect(StringUtils.indexOf("aabaabaa", "a")).toBe(0);
    });
    test("应该找到起始位置之后的字符索引", () => {
      expect(StringUtils.indexOf("aabaabaa", "b", 3)).toBe(5);
    });
    test("如果未找到字符应该返回-1", () => {
      expect(StringUtils.indexOf("aabaabaa", "c")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
  });

  // 11. lastIndexOf 测试
  describe("lastIndexOf", () => {
    test("对null字符串应该返回-1", () => {
      expect(StringUtils.lastIndexOf(nullStr, "a")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
    test("对undefined字符串应该返回-1", () => {
      expect(StringUtils.lastIndexOf(ufdStr, "a")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
    test("对空字符串应该返回-1", () => {
      expect(StringUtils.lastIndexOf("", "a")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
    test("应该找到字符的最后索引", () => {
      expect(StringUtils.lastIndexOf("aabaabaa", "b")).toBe(5);
    });
    test("应该找到位置之前的字符最后索引", () => {
      expect(StringUtils.lastIndexOf("aabaabaa", "b", 4)).toBe(2);
    });
    test("如果未找到字符应该返回-1", () => {
      expect(StringUtils.lastIndexOf("aabaabaa", "c")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
  });

  // 12. contains 测试
  describe("contains", () => {
    test("对null字符串应该返回false", () => {
      expect(StringUtils.contains(nullStr, "a")).toBe(false);
    });
    test("对undefined字符串应该返回false", () => {
      expect(StringUtils.contains(ufdStr, "a")).toBe(false);
    });
    test("对空字符串应该返回false", () => {
      expect(StringUtils.contains("", "a")).toBe(false);
    });
    test("如果包含字符应该返回true", () => {
      expect(StringUtils.contains("aabaabaa", "b")).toBe(true);
    });
    test("如果不包含字符应该返回false", () => {
      expect(StringUtils.contains("aabaabaa", "c")).toBe(false);
    });
  });

  // 13. containsIgnoreCase 测试
  describe("containsIgnoreCase", () => {
    test("对null字符串应该返回false", () => {
      expect(StringUtils.containsIgnoreCase(nullStr, "a")).toBe(false);
    });
    test("对undefined字符串应该返回false", () => {
      expect(StringUtils.containsIgnoreCase(ufdStr, "a")).toBe(false);
    });
    test("对空字符串应该返回false", () => {
      expect(StringUtils.containsIgnoreCase("", "a")).toBe(false);
    });
    test("如果忽略大小写包含字符应该返回true", () => {
      expect(StringUtils.containsIgnoreCase("aabaabaa", "B")).toBe(true);
    });
    test("如果忽略大小写不包含字符应该返回false", () => {
      expect(StringUtils.containsIgnoreCase("aabaabaa", "C")).toBe(false);
    });
  });

  // 14. subString 测试
  describe("subString", () => {
    test("对null字符串应该返回null", () => {
      expect(StringUtils.subString(nullStr, 0)).toBe(null);
    });
    test("对undefined字符串应该返回null", () => {
      expect(StringUtils.subString(ufdStr, 0)).toBe(null);
    });
    test("对非字符串输入应该返回null", () => {
      expect(StringUtils.subString(123 as unknown as string, 0)).toBe(null);
    });
    test("应该返回子字符串", () => {
      expect(StringUtils.subString("abcdef", 2, 4)).toBe("cd");
    });
    test("如果end未定义应该返回完整字符串", () => {
      expect(StringUtils.subString("abcdef", 2)).toBe("cdef");
    });
    test("如果start大于等于长度应该返回空字符串", () => {
      expect(StringUtils.subString("abc", 5)).toBe("");
    });
  });

  // 15. startWith 测试
  describe("startWith", () => {
    test("对null字符串应该返回false", () => {
      expect(StringUtils.startWith(nullStr, "a")).toBe(false);
    });
    test("对undefined字符串应该返回false", () => {
      expect(StringUtils.startWith(ufdStr, "a")).toBe(false);
    });
    test("对空字符串应该返回false", () => {
      expect(StringUtils.startWith("", "a")).toBe(false);
    });
    test("如果字符串以前缀开头应该返回true", () => {
      expect(StringUtils.startWith("abcdef", "ab")).toBe(true);
    });
    test("如果字符串不以前缀开头应该返回false", () => {
      expect(StringUtils.startWith("abcdef", "cd")).toBe(false);
    });
  });

  // 16. startWithIgnoreCase 测试
  describe("startWithIgnoreCase", () => {
    test("对null字符串应该返回false", () => {
      expect(StringUtils.startWithIgnoreCase(nullStr, "a")).toBe(false);
    });
    test("对undefined字符串应该返回false", () => {
      expect(StringUtils.startWithIgnoreCase(ufdStr, "a")).toBe(false);
    });
    test("对空字符串应该返回false", () => {
      expect(StringUtils.startWithIgnoreCase("", "a")).toBe(false);
    });
    test("如果忽略大小写字符串以前缀开头应该返回true", () => {
      expect(StringUtils.startWithIgnoreCase("abcdef", "AB")).toBe(true);
    });
    test("如果忽略大小写字符串不以前缀开头应该返回false", () => {
      expect(StringUtils.startWithIgnoreCase("abcdef", "CD")).toBe(false);
    });
  });

  // 17. endWith 测试
  describe("endWith", () => {
    test("对null字符串应该返回false", () => {
      expect(StringUtils.endWith(nullStr, "a")).toBe(false);
    });
    test("对undefined字符串应该返回false", () => {
      expect(StringUtils.endWith(ufdStr, "a")).toBe(false);
    });
    test("对空字符串应该返回false", () => {
      expect(StringUtils.endWith("", "a")).toBe(false);
    });
    test("如果字符串以后缀结尾应该返回true", () => {
      expect(StringUtils.endWith("abcdef", "ef")).toBe(true);
    });
    test("如果字符串不以后缀结尾应该返回false", () => {
      expect(StringUtils.endWith("abcdef", "cd")).toBe(false);
    });
  });

  // 18. endWithIgnoreCase 测试
  describe("endWithIgnoreCase", () => {
    test("对null字符串应该返回false", () => {
      expect(StringUtils.endWithIgnoreCase(nullStr, "a")).toBe(false);
    });
    test("对undefined字符串应该返回false", () => {
      expect(StringUtils.endWithIgnoreCase(ufdStr, "a")).toBe(false);
    });
    test("对空字符串应该返回false", () => {
      expect(StringUtils.endWithIgnoreCase("", "a")).toBe(false);
    });
    test("如果忽略大小写字符串以后缀结尾应该返回true", () => {
      expect(StringUtils.endWithIgnoreCase("abcdef", "EF")).toBe(true);
    });
    test("如果忽略大小写字符串不以后缀结尾应该返回false", () => {
      expect(StringUtils.endWithIgnoreCase("abcdef", "CD")).toBe(false);
    });
  });

  // 19. isWhitespace 测试
  describe("isWhitespace", () => {
    test("对空格字符应该返回true", () => {
      expect(StringUtils.isWhitespace(" ")).toBe(true);
    });
    test("对非空格字符应该返回false", () => {
      expect(StringUtils.isWhitespace("a")).toBe(false);
    });
    test("对换行符应该返回true", () => {
      expect(StringUtils.isWhitespace("\n")).toBe(true);
    });
    test("对制表符应该返回true", () => {
      expect(StringUtils.isWhitespace("\t")).toBe(true);
    });
  });

  // 20. newGuid 测试
  describe("newGuid", () => {
    test("应该返回有效的GUID格式", () => {
      const guid = StringUtils.newGuid();
      expect(guid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
  });

  // 21. snakeCase 测试
  describe("snakeCase", () => {
    test("对空输入应该返回空字符串", () => {
      expect(StringUtils.snakeCase("")).toBe("");
    });
    test("应该将驼峰式转换为蛇形式", () => {
      expect(StringUtils.snakeCase("camelCase")).toBe("camel_case");
    });
    test("应该将空格字符串转换为蛇形式", () => {
      expect(StringUtils.snakeCase("sentence case")).toBe("sentence_case");
    });
    test("应该处理特殊字符", () => {
      expect(StringUtils.snakeCase("Abc ___ 123 ___ xYz")).toBe("abc_123_x_yz");
    });
    test("对大写字符串应该返回蛇形式", () => {
      expect(StringUtils.snakeCase("UPPER_CASE")).toBe("upper_case");
    });
    test("对混合大小写应该返回蛇形式", () => {
      expect(StringUtils.snakeCase("PascalCase")).toBe("pascal_case");
    });
  });

  // 22. replaceAll 测试
  describe("replaceAll", () => {
    test("对null输入应该返回null", () => {
      expect(StringUtils.replaceAll(nullStr, "a", "b")).toBe(null);
    });
    test("应该替换所有出现的内容", () => {
      expect(StringUtils.replaceAll("aa", "a", "b")).toBe("bb");
    });
    test("应该处理空字符串", () => {
      expect(StringUtils.replaceAll("", "a", "b")).toBe("");
    });
    test("应该用空字符串替换", () => {
      expect(StringUtils.replaceAll("abc", "b", "")).toBe("ac");
    });
  });

  // 23. join 测试
  describe("join", () => {
    test("对空数组应该返回空字符串", () => {
      expect(StringUtils.join([])).toBe("");
    });
    test("应该用分隔符连接数组", () => {
      expect(StringUtils.join(["a", "b", "c"], "-")).toBe("a-b-c");
    });
    test("当分隔符为null时应该不带分隔符连接数组", () => {
      expect(StringUtils.join(["a", "b", "c"], nullStr)).toBe("abc");
    });
    test("应该处理数组中的混合类型", () => {
      expect(StringUtils.join([1, 2, 3], "-")).toBe("1-2-3");
    });
  });

  // 24. stripToNull 测试
  describe("stripToNull", () => {
    test("对空字符串应该返回null", () => {
      expect(StringUtils.stripToNull("")).toBe(null);
    });
    test("对非空字符串应该返回字符串", () => {
      expect(StringUtils.stripToNull("1-2-3")).toBe("1-2-3");
    });
  });

  // 25. stripToEmpty 测试
  describe("stripToEmpty", () => {
    test("对空字符串应该返回空字符串", () => {
      expect(StringUtils.stripToEmpty("")).toBe("");
    });
    test("对非空字符串应该返回字符串", () => {
      expect(StringUtils.stripToEmpty("1-2-3")).toBe("1-2-3");
    });
  });
});
