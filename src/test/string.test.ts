import StringUtils from "../utils/string.utils";

const nullStr = null as unknown as string;
const nullStr1 = null as unknown as string;
const ufdStr = undefined as unknown as string;

describe("StringUtils", () => {
  // 1. isEmpty 测试
  describe("isEmpty", () => {
    test("should return true for null", () => {
      expect(StringUtils.isEmpty(null)).toBe(true);
    });
    test("should return true for undefined", () => {
      expect(StringUtils.isEmpty(undefined)).toBe(true);
    });
    test("should return true for empty string", () => {
      expect(StringUtils.isEmpty("")).toBe(true);
    });
    test("should return false for non-empty string", () => {
      expect(StringUtils.isEmpty("bob")).toBe(false);
    });
    test("should return false for string with spaces", () => {
      expect(StringUtils.isEmpty(" ")).toBe(false);
    });
  });

  // 2. isNotEmpty 测试
  describe("isNotEmpty", () => {
    test("should return false for null", () => {
      expect(StringUtils.isNotEmpty(null)).toBe(false);
    });
    test("should return false for undefined", () => {
      expect(StringUtils.isNotEmpty(undefined)).toBe(false);
    });
    test("should return false for empty string", () => {
      expect(StringUtils.isNotEmpty("")).toBe(false);
    });
    test("should return true for non-empty string", () => {
      expect(StringUtils.isNotEmpty("bob")).toBe(true);
    });
  });

  // 3. isBlank 测试
  describe("isBlank", () => {
    test("should return true for null", () => {
      expect(StringUtils.isBlank(null)).toBe(true);
    });
    test("should return true for undefined", () => {
      expect(StringUtils.isBlank(undefined)).toBe(true);
    });
    test("should return true for empty string", () => {
      expect(StringUtils.isBlank("")).toBe(true);
    });
    test("should return true for string with spaces", () => {
      expect(StringUtils.isBlank(" ")).toBe(true);
    });
    test("should return false for non-blank string", () => {
      expect(StringUtils.isBlank("bob")).toBe(false);
    });
  });

  // 4. trim 测试
  describe("trim", () => {
    test("should return null for null", () => {
      expect(StringUtils.trim(nullStr)).toBe(null);
    });
    test("should return undefined for undefined", () => {
      expect(StringUtils.trim(ufdStr)).toBe(undefined);
    });
    test("should return empty string for empty string", () => {
      expect(StringUtils.trim("")).toBe("");
    });
    test("should trim whitespace", () => {
      expect(StringUtils.trim("  a  ")).toBe("a");
    });
  });

  // 5. trimToNull 测试
  describe("trimToNull", () => {
    test("should return null for null", () => {
      expect(StringUtils.trimToNull(nullStr)).toBe(null);
    });
    test("should return null for undefined", () => {
      expect(StringUtils.trimToNull(ufdStr)).toBe(null);
    });
    test("should return null for empty string", () => {
      expect(StringUtils.trimToNull("")).toBe(null);
    });
    test("should return null for whitespace string", () => {
      expect(StringUtils.trimToNull("    ")).toBe(null);
    });
    test("should trim and return non-empty string", () => {
      expect(StringUtils.trimToNull("  a  ")).toBe("a");
    });
  });

  // 6. trimToEmpty 测试
  describe("trimToEmpty", () => {
    test("should return empty string for null", () => {
      expect(StringUtils.trimToEmpty(nullStr)).toBe("");
    });
    test("should return empty string for undefined", () => {
      expect(StringUtils.trimToEmpty(ufdStr)).toBe("");
    });
    test("should return empty string for empty string", () => {
      expect(StringUtils.trimToEmpty("")).toBe("");
    });
    test("should return empty string for whitespace string", () => {
      expect(StringUtils.trimToEmpty("    ")).toBe("");
    });
    test("should trim and return non-empty string", () => {
      expect(StringUtils.trimToEmpty("  a  ")).toBe("a");
    });
  });

  // 7. strip 测试
  describe("strip", () => {
    test("should return null for null", () => {
      expect(StringUtils.strip(null)).toBe(null);
    });
    test("should return empty string for empty string", () => {
      expect(StringUtils.strip("")).toBe("");
    });
    test("should strip whitespace", () => {
      expect(StringUtils.strip("  a  ")).toBe("a");
    });
    test("should strip specific characters", () => {
      expect(StringUtils.strip("xyzabcxyz", "xyz")).toBe("abc");
    });
  });

  // 8. equals 测试
  describe("equals", () => {
    test("should return true for null and null", () => {
      expect(StringUtils.equals(nullStr, nullStr1)).toBe(true);
    });
    test("should return false for null and non-null", () => {
      expect(StringUtils.equals(nullStr, "abc")).toBe(false);
    });
    test("should return false for different strings", () => {
      expect(StringUtils.equals("abc", "def")).toBe(false);
    });
    test("should return true for same strings", () => {
      expect(StringUtils.equals("abc", "abc")).toBe(true);
    });
    test("should return false for different cases", () => {
      expect(StringUtils.equals("abc", "ABC")).toBe(false);
    });
  });

  // 9. equalsIgnoreCase 测试
  describe("equalsIgnoreCase", () => {
    test("should return true for null and null", () => {
      expect(StringUtils.equalsIgnoreCase(nullStr, nullStr1)).toBe(true);
    });
    test("should return false for null and non-null", () => {
      expect(StringUtils.equalsIgnoreCase(nullStr, "abc")).toBe(false);
    });
    test("should return false for different strings", () => {
      expect(StringUtils.equalsIgnoreCase("abc", "def")).toBe(false);
    });
    test("should return true for same strings", () => {
      expect(StringUtils.equalsIgnoreCase("abc", "abc")).toBe(true);
    });
    test("should return true for different cases", () => {
      expect(StringUtils.equalsIgnoreCase("abc", "ABC")).toBe(true);
    });
  });

  // 10. indexOf 测试
  describe("indexOf", () => {
    test("should return -1 for null string", () => {
      expect(StringUtils.indexOf(nullStr, "a")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
    test("should return -1 for undefined string", () => {
      expect(StringUtils.indexOf(ufdStr, "a")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
    test("should return -1 for empty string", () => {
      expect(StringUtils.indexOf("", "a")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
    test("should find index of character", () => {
      expect(StringUtils.indexOf("aabaabaa", "a")).toBe(0);
    });
    test("should find index of character after start position", () => {
      expect(StringUtils.indexOf("aabaabaa", "b", 3)).toBe(5);
    });
    test("should return -1 if character not found", () => {
      expect(StringUtils.indexOf("aabaabaa", "c")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
  });

  // 11. lastIndexOf 测试
  describe("lastIndexOf", () => {
    test("should return -1 for null string", () => {
      expect(StringUtils.lastIndexOf(nullStr, "a")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
    test("should return -1 for undefined string", () => {
      expect(StringUtils.lastIndexOf(ufdStr, "a")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
    test("should return -1 for empty string", () => {
      expect(StringUtils.lastIndexOf("", "a")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
    test("should find last index of character", () => {
      expect(StringUtils.lastIndexOf("aabaabaa", "b")).toBe(5);
    });
    test("should find last index of character before position", () => {
      expect(StringUtils.lastIndexOf("aabaabaa", "b", 4)).toBe(2);
    });
    test("should return -1 if character not found", () => {
      expect(StringUtils.lastIndexOf("aabaabaa", "c")).toBe(StringUtils.INDEX_NOT_FOUND);
    });
  });

  // 12. contains 测试
  describe("contains", () => {
    test("should return false for null string", () => {
      expect(StringUtils.contains(nullStr, "a")).toBe(false);
    });
    test("should return false for undefined string", () => {
      expect(StringUtils.contains(ufdStr, "a")).toBe(false);
    });
    test("should return false for empty string", () => {
      expect(StringUtils.contains("", "a")).toBe(false);
    });
    test("should return true if contains character", () => {
      expect(StringUtils.contains("aabaabaa", "b")).toBe(true);
    });
    test("should return false if does not contain character", () => {
      expect(StringUtils.contains("aabaabaa", "c")).toBe(false);
    });
  });

  // 13. containsIgnoreCase 测试
  describe("containsIgnoreCase", () => {
    test("should return false for null string", () => {
      expect(StringUtils.containsIgnoreCase(nullStr, "a")).toBe(false);
    });
    test("should return false for undefined string", () => {
      expect(StringUtils.containsIgnoreCase(ufdStr, "a")).toBe(false);
    });
    test("should return false for empty string", () => {
      expect(StringUtils.containsIgnoreCase("", "a")).toBe(false);
    });
    test("should return true if contains character ignoring case", () => {
      expect(StringUtils.containsIgnoreCase("aabaabaa", "B")).toBe(true);
    });
    test("should return false if does not contain character ignoring case", () => {
      expect(StringUtils.containsIgnoreCase("aabaabaa", "C")).toBe(false);
    });
  });

  // 14. subString 测试
  describe("subString", () => {
    test("should return null for null string", () => {
      expect(StringUtils.subString(nullStr, 0)).toBe(null);
    });
    test("should return null for undefined string", () => {
      expect(StringUtils.subString(ufdStr, 0)).toBe(null);
    });
    test("should return null for non-string input", () => {
      expect(StringUtils.subString(123 as unknown as string, 0)).toBe(null);
    });
    test("should return substring", () => {
      expect(StringUtils.subString("abcdef", 2, 4)).toBe("cd");
    });
    test("should return full string if end is undefined", () => {
      expect(StringUtils.subString("abcdef", 2)).toBe("cdef");
    });
    test("should return empty string if start >= length", () => {
      expect(StringUtils.subString("abc", 5)).toBe("");
    });
  });

  // 15. startWith 测试
  describe("startWith", () => {
    test("should return false for null string", () => {
      expect(StringUtils.startWith(nullStr, "a")).toBe(false);
    });
    test("should return false for undefined string", () => {
      expect(StringUtils.startWith(ufdStr, "a")).toBe(false);
    });
    test("should return false for empty string", () => {
      expect(StringUtils.startWith("", "a")).toBe(false);
    });
    test("should return true if string starts with prefix", () => {
      expect(StringUtils.startWith("abcdef", "ab")).toBe(true);
    });
    test("should return false if string does not start with prefix", () => {
      expect(StringUtils.startWith("abcdef", "cd")).toBe(false);
    });
  });

  // 16. startWithIgnoreCase 测试
  describe("startWithIgnoreCase", () => {
    test("should return false for null string", () => {
      expect(StringUtils.startWithIgnoreCase(nullStr, "a")).toBe(false);
    });
    test("should return false for undefined string", () => {
      expect(StringUtils.startWithIgnoreCase(ufdStr, "a")).toBe(false);
    });
    test("should return false for empty string", () => {
      expect(StringUtils.startWithIgnoreCase("", "a")).toBe(false);
    });
    test("should return true if string starts with prefix ignoring case", () => {
      expect(StringUtils.startWithIgnoreCase("abcdef", "AB")).toBe(true);
    });
    test("should return false if string does not start with prefix ignoring case", () => {
      expect(StringUtils.startWithIgnoreCase("abcdef", "CD")).toBe(false);
    });
  });

  // 17. endWith 测试
  describe("endWith", () => {
    test("should return false for null string", () => {
      expect(StringUtils.endWith(nullStr, "a")).toBe(false);
    });
    test("should return false for undefined string", () => {
      expect(StringUtils.endWith(ufdStr, "a")).toBe(false);
    });
    test("should return false for empty string", () => {
      expect(StringUtils.endWith("", "a")).toBe(false);
    });
    test("should return true if string ends with suffix", () => {
      expect(StringUtils.endWith("abcdef", "ef")).toBe(true);
    });
    test("should return false if string does not end with suffix", () => {
      expect(StringUtils.endWith("abcdef", "cd")).toBe(false);
    });
  });

  // 18. endWithIgnoreCase 测试
  describe("endWithIgnoreCase", () => {
    test("should return false for null string", () => {
      expect(StringUtils.endWithIgnoreCase(nullStr, "a")).toBe(false);
    });
    test("should return false for undefined string", () => {
      expect(StringUtils.endWithIgnoreCase(ufdStr, "a")).toBe(false);
    });
    test("should return false for empty string", () => {
      expect(StringUtils.endWithIgnoreCase("", "a")).toBe(false);
    });
    test("should return true if string ends with suffix ignoring case", () => {
      expect(StringUtils.endWithIgnoreCase("abcdef", "EF")).toBe(true);
    });
    test("should return false if string does not end with suffix ignoring case", () => {
      expect(StringUtils.endWithIgnoreCase("abcdef", "CD")).toBe(false);
    });
  });

  // 19. isWhitespace 测试
  describe("isWhitespace", () => {
    test("should return true for whitespace character", () => {
      expect(StringUtils.isWhitespace(" ")).toBe(true);
    });
    test("should return false for non-whitespace character", () => {
      expect(StringUtils.isWhitespace("a")).toBe(false);
    });
    test("should return true for newline character", () => {
      expect(StringUtils.isWhitespace("\n")).toBe(true);
    });
    test("should return true for tab character", () => {
      expect(StringUtils.isWhitespace("\t")).toBe(true);
    });
  });

  // 20. newGuid 测试
  describe("newGuid", () => {
    test("should return a valid GUID format", () => {
      const guid = StringUtils.newGuid();
      expect(guid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
  });

  // 21. snakeCase 测试
  describe("snakeCase", () => {
    test("should return empty string for empty input", () => {
      expect(StringUtils.snakeCase("")).toBe("");
    });
    test("should convert camelCase to snake_case", () => {
      expect(StringUtils.snakeCase("camelCase")).toBe("camel_case");
    });
    test("should convert spaced string to snake_case", () => {
      expect(StringUtils.snakeCase("sentence case")).toBe("sentence_case");
    });
    test("should handle special characters", () => {
      expect(StringUtils.snakeCase("Abc ___ 123 ___ xYz")).toBe("abc_123_x_yz");
    });
    test("should return snake_case for upper case", () => {
      expect(StringUtils.snakeCase("UPPER_CASE")).toBe("upper_case");
    });
    test("should return snake_case for mixed cases", () => {
      expect(StringUtils.snakeCase("PascalCase")).toBe("pascal_case");
    });
  });

  // 22. replaceAll 测试
  describe("replaceAll", () => {
    test("should return null for null input", () => {
      expect(StringUtils.replaceAll(nullStr, "a", "b")).toBe(null);
    });
    test("should replace all occurrences", () => {
      expect(StringUtils.replaceAll("aa", "a", "b")).toBe("bb");
    });
    test("should handle empty string", () => {
      expect(StringUtils.replaceAll("", "a", "b")).toBe("");
    });
    test("should replace with empty string", () => {
      expect(StringUtils.replaceAll("abc", "b", "")).toBe("ac");
    });
  });

  // 23. join 测试
  describe("join", () => {
    test("should return empty string for empty array", () => {
      expect(StringUtils.join([])).toBe("");
    });
    test("should join array with separator", () => {
      expect(StringUtils.join(["a", "b", "c"], "-")).toBe("a-b-c");
    });
    test("should join array without separator when null", () => {
      expect(StringUtils.join(["a", "b", "c"], nullStr)).toBe("abc");
    });
    test("should handle mixed types in array", () => {
      expect(StringUtils.join([1, 2, 3], "-")).toBe("1-2-3");
    });
  });

  // 24. stripToNull 测试
  describe("stripToNull", () => {
    test("should return null for empty string", () => {
      expect(StringUtils.stripToNull("")).toBe(null);
    });
    test("should return string for non-empty string", () => {
      expect(StringUtils.stripToNull("1-2-3")).toBe("1-2-3");
    });
  });

  // 25. stripToEmpty 测试
  describe("stripToEmpty", () => {
    test("should return empty string for empty string", () => {
      expect(StringUtils.stripToEmpty("")).toBe("");
    });
    test("should return string for non-empty string", () => {
      expect(StringUtils.stripToEmpty("1-2-3")).toBe("1-2-3");
    });
  });
});
