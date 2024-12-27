import ObjectUtils from "../utils/object.utils";

describe("ObjectUtils", () => {
  describe("isNull", () => {
    test("should return true for null", () => {
      expect(ObjectUtils.isNull(null)).toBe(true);
    });
    test("should return false for undefined", () => {
      expect(ObjectUtils.isNull(undefined)).toBe(false);
    });
    test("should return false for non-null values", () => {
      expect(ObjectUtils.isNull({})).toBe(false);
      expect(ObjectUtils.isNull(1)).toBe(false);
    });
  });

  describe("isUndefinend", () => {
    test("should return true for undefined", () => {
      expect(ObjectUtils.isUndefinend(undefined)).toBe(true);
    });
    test("should return false for null", () => {
      expect(ObjectUtils.isUndefinend(null)).toBe(false);
    });
    test("should return false for non-undefined values", () => {
      expect(ObjectUtils.isUndefinend({})).toBe(false);
      expect(ObjectUtils.isUndefinend(1)).toBe(false);
    });
  });

  describe("isNullOrUndefined", () => {
    test("should return true for null", () => {
      expect(ObjectUtils.isNullOrUndefined(null)).toBe(true);
    });
    test("should return true for undefined", () => {
      expect(ObjectUtils.isNullOrUndefined(undefined)).toBe(true);
    });
    test("should return false for other values", () => {
      expect(ObjectUtils.isNullOrUndefined({})).toBe(false);
      expect(ObjectUtils.isNullOrUndefined(1)).toBe(false);
    });
  });

  describe("isArray", () => {
    test("should return true for arrays", () => {
      expect(ObjectUtils.isArray([])).toBe(true);
    });
    test("should return false for non-arrays", () => {
      expect(ObjectUtils.isArray(null)).toBe(false);
      expect(ObjectUtils.isArray(undefined)).toBe(false);
      expect(ObjectUtils.isArray(1)).toBe(false);
    });
  });

  describe("isDate", () => {
    test("should return true for Date objects", () => {
      expect(ObjectUtils.isDate(new Date())).toBe(true);
    });
    test("should return false for non-Date values", () => {
      expect(ObjectUtils.isDate(null)).toBe(false);
      expect(ObjectUtils.isDate(undefined)).toBe(false);
      expect(ObjectUtils.isDate(1)).toBe(false);
    });
  });

  describe("isString", () => {
    test("should return true for strings", () => {
      expect(ObjectUtils.isString("test")).toBe(true);
    });
    test("should return false for non-strings", () => {
      expect(ObjectUtils.isString(null)).toBe(false);
      expect(ObjectUtils.isString(undefined)).toBe(false);
      expect(ObjectUtils.isString(1)).toBe(false);
    });
  });

  describe("isNumber", () => {
    test("should return true for numbers", () => {
      expect(ObjectUtils.isNumber(1)).toBe(true);
    });
    test("should return false for non-numbers", () => {
      expect(ObjectUtils.isNumber(null)).toBe(false);
      expect(ObjectUtils.isNumber(undefined)).toBe(false);
      expect(ObjectUtils.isNumber("test")).toBe(false);
    });
  });

  describe("isBoolean", () => {
    test("should return true for booleans", () => {
      expect(ObjectUtils.isBoolean(false)).toBe(true);
    });
    test("should return false for non-booleans", () => {
      expect(ObjectUtils.isBoolean(null)).toBe(false);
      expect(ObjectUtils.isBoolean(undefined)).toBe(false);
      expect(ObjectUtils.isBoolean("test")).toBe(false);
    });
  });

  describe("toSafeString", () => {
    test("should return empty string for null", () => {
      expect(ObjectUtils.toSafeString(null)).toBe("");
    });
    test("should return empty string for undefined", () => {
      expect(ObjectUtils.toSafeString(undefined)).toBe("");
    });
    test("should return the string for other values", () => {
      expect(ObjectUtils.toSafeString("test")).toBe("test");
    });
    test("should return default value for null", () => {
      expect(ObjectUtils.toSafeString(null, "--")).toBe("--");
    });
    test("should return default value for undefined", () => {
      expect(ObjectUtils.toSafeString(undefined, "--")).toBe("--");
    });
  });

  describe("getProperty", () => {
    test("should return the property value from the object", () => {
      const obj = { a: 1, b: 2 };
      expect(ObjectUtils.getProperty(obj, "a")).toBe(1);
    });
  });

  describe("setProperty", () => {
    test("should set the property value in the object", () => {
      const obj = { a: 1 };
      ObjectUtils.setProperty(obj, "a", 2);
      expect(obj.a).toBe(2);
    });
  });

  describe("createObject", () => {
    test("should create an instance of the given type", () => {
      class Test {
        constructor(public value: number) {}
      }
      const instance = ObjectUtils.createObject(Test, 10);
      expect(instance.value).toBe(10);
    });
    test("should create an empty object if the type is null", () => {
      const instance = ObjectUtils.createObject(null as any) as object;
      expect(Reflect.ownKeys(instance).length).toBe(0);
    });
  });

  describe("getPropertyName", () => {
    test("should return the string representation of the property name", () => {
      expect(ObjectUtils.getPropertyName("a")).toBe("a");
    });
  });

  describe("values", () => {
    test("should return values of the object", () => {
      const obj = { a: 1, b: 2 };
      expect(ObjectUtils.values(obj)).toEqual([1, 2]);
    });
    test("should return an empty array for null or undefined", () => {
      expect(ObjectUtils.values(null)).toEqual([]);
      expect(ObjectUtils.values(undefined)).toEqual([]);
    });
  });

  describe("getDescendantProperty", () => {
    test("should return the matching descendant property", () => {
      const obj = { p1: { p2: 1 } };
      expect(ObjectUtils.getDescendantProperty(obj, "p1", "p2")).toBe(1);
    });
    test("should return undefined for non-existing properties", () => {
      const obj = { p1: { p2: 1 } };
      expect(ObjectUtils.getDescendantProperty(obj, "p1", "p3")).toBeUndefined();
    });
    test("should return the matching descendant property", () => {
      const obj = { p1: { p2: 1 } };
      expect(ObjectUtils.getDescendantProperty(obj.p1.p2)).toBe(1);
    });
    test("should return undefined for null or undefined", () => {
      expect(ObjectUtils.getDescendantProperty(undefined)).toBeUndefined();
      expect(ObjectUtils.getDescendantProperty(null)).toBeUndefined();
    });
  });

  describe("getOrDefault", () => {
    test("should return the value if it exists", () => {
      const value: number = 1;
      expect(ObjectUtils.getOrDefault(value, 0)).toBe(1);
    });
    test("should return default value for null", () => {
      expect(ObjectUtils.getOrDefault(null, 0)).toBe(0);
    });
    test("should return default value for undefined", () => {
      expect(ObjectUtils.getOrDefault(undefined, "1")).toBe("1");
    });
  });

  describe("hasValue", () => {
    test("should return true for non-null and non-undefined values", () => {
      expect(ObjectUtils.hasValue(1)).toBe(true);
      expect(ObjectUtils.hasValue("str")).toBe(true);
    });
    test("should return false for null and undefined", () => {
      expect(ObjectUtils.hasValue(undefined)).toBe(false);
      expect(ObjectUtils.hasValue(null)).toBe(false);
    });
  });
});
