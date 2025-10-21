import ObjectUtils from "../utils/object.utils";

describe("ObjectUtils", () => {
  describe("isNull", () => {
    test("对null应该返回true", () => {
      expect(ObjectUtils.isNull(null)).toBe(true);
    });
    test("对undefined应该返回false", () => {
      expect(ObjectUtils.isNull(undefined)).toBe(false);
    });
    test("对非null值应该返回false", () => {
      expect(ObjectUtils.isNull({})).toBe(false);
      expect(ObjectUtils.isNull(1)).toBe(false);
    });
  });

  describe("isUndefined", () => {
    test("对undefined应该返回true", () => {
      expect(ObjectUtils.isUndefined(undefined)).toBe(true);
    });
    test("对null应该返回false", () => {
      expect(ObjectUtils.isUndefined(null)).toBe(false);
    });
    test("对非undefined值应该返回false", () => {
      expect(ObjectUtils.isUndefined({})).toBe(false);
      expect(ObjectUtils.isUndefined(1)).toBe(false);
    });
  });

  describe("isNullOrUndefined", () => {
    test("对null应该返回true", () => {
      expect(ObjectUtils.isNullOrUndefined(null)).toBe(true);
    });
    test("对undefined应该返回true", () => {
      expect(ObjectUtils.isNullOrUndefined(undefined)).toBe(true);
    });
    test("对其他值应该返回false", () => {
      expect(ObjectUtils.isNullOrUndefined({})).toBe(false);
      expect(ObjectUtils.isNullOrUndefined(1)).toBe(false);
    });
  });

  describe("isArray", () => {
    test("对数组应该返回true", () => {
      expect(ObjectUtils.isArray([])).toBe(true);
    });
    test("对非数组应该返回false", () => {
      expect(ObjectUtils.isArray(null)).toBe(false);
      expect(ObjectUtils.isArray(undefined)).toBe(false);
      expect(ObjectUtils.isArray(1)).toBe(false);
    });
  });

  describe("isDate", () => {
    test("对Date对象应该返回true", () => {
      expect(ObjectUtils.isDate(new Date())).toBe(true);
    });
    test("对非Date值应该返回false", () => {
      expect(ObjectUtils.isDate(null)).toBe(false);
      expect(ObjectUtils.isDate(undefined)).toBe(false);
      expect(ObjectUtils.isDate(1)).toBe(false);
    });
  });

  describe("isString", () => {
    test("对字符串应该返回true", () => {
      expect(ObjectUtils.isString("test")).toBe(true);
    });
    test("对非字符串应该返回false", () => {
      expect(ObjectUtils.isString(null)).toBe(false);
      expect(ObjectUtils.isString(undefined)).toBe(false);
      expect(ObjectUtils.isString(1)).toBe(false);
    });
  });

  describe("isNumber", () => {
    test("对有限数字应该返回true", () => {
      expect(ObjectUtils.isNumber(1)).toBe(true);
      expect(ObjectUtils.isNumber(0)).toBe(true);
      expect(ObjectUtils.isNumber(-1)).toBe(true);
      expect(ObjectUtils.isNumber(1.5)).toBe(true);
    });
    test("对NaN和Infinity应该返回false", () => {
      expect(ObjectUtils.isNumber(NaN)).toBe(false);
      expect(ObjectUtils.isNumber(Infinity)).toBe(false);
      expect(ObjectUtils.isNumber(-Infinity)).toBe(false);
    });
    test("对非数字应该返回false", () => {
      expect(ObjectUtils.isNumber(null)).toBe(false);
      expect(ObjectUtils.isNumber(undefined)).toBe(false);
      expect(ObjectUtils.isNumber("test")).toBe(false);
    });
  });

  describe("isBoolean", () => {
    test("对布尔值应该返回true", () => {
      expect(ObjectUtils.isBoolean(false)).toBe(true);
      expect(ObjectUtils.isBoolean(true)).toBe(true);
    });
    test("对非布尔值应该返回false", () => {
      expect(ObjectUtils.isBoolean(null)).toBe(false);
      expect(ObjectUtils.isBoolean(undefined)).toBe(false);
      expect(ObjectUtils.isBoolean("test")).toBe(false);
    });
  });

  describe("isFunction", () => {
    test("对函数应该返回true", () => {
      expect(ObjectUtils.isFunction(() => {})).toBe(true);
      expect(ObjectUtils.isFunction(function () {})).toBe(true);
      expect(ObjectUtils.isFunction(Object)).toBe(true);
    });
    test("对非函数应该返回false", () => {
      expect(ObjectUtils.isFunction(null)).toBe(false);
      expect(ObjectUtils.isFunction(undefined)).toBe(false);
      expect(ObjectUtils.isFunction({})).toBe(false);
    });
  });

  describe("isPromise", () => {
    test("对Promise应该返回true", () => {
      expect(ObjectUtils.isPromise(Promise.resolve())).toBe(true);
      expect(ObjectUtils.isPromise(new Promise(() => {}))).toBe(true);
      expect(ObjectUtils.isPromise({ then: () => {} })).toBe(true);
    });
    test("对非Promise应该返回false", () => {
      expect(ObjectUtils.isPromise(null)).toBe(false);
      expect(ObjectUtils.isPromise(undefined)).toBe(false);
      expect(ObjectUtils.isPromise({})).toBe(false);
    });
  });

  describe("isRegExp", () => {
    test("对正则表达式应该返回true", () => {
      expect(ObjectUtils.isRegExp(/test/)).toBe(true);
      expect(ObjectUtils.isRegExp(new RegExp("test"))).toBe(true);
    });
    test("对非正则表达式应该返回false", () => {
      expect(ObjectUtils.isRegExp(null)).toBe(false);
      expect(ObjectUtils.isRegExp(undefined)).toBe(false);
      expect(ObjectUtils.isRegExp("test")).toBe(false);
    });
  });

  describe("toSafeString", () => {
    test("对null应该返回空字符串", () => {
      expect(ObjectUtils.toSafeString(null)).toBe("");
    });
    test("对undefined应该返回空字符串", () => {
      expect(ObjectUtils.toSafeString(undefined)).toBe("");
    });
    test("对其他值应该返回字符串", () => {
      expect(ObjectUtils.toSafeString("test")).toBe("test");
    });
    test("对null应该返回默认值", () => {
      expect(ObjectUtils.toSafeString(null, "--")).toBe("--");
    });
    test("对undefined应该返回默认值", () => {
      expect(ObjectUtils.toSafeString(undefined, "--")).toBe("--");
    });
  });

  describe("getProperty", () => {
    test("应该从对象中返回属性值", () => {
      const obj = { a: 1, b: 2 };
      expect(ObjectUtils.getProperty(obj, "a")).toBe(1);
    });
  });

  describe("setProperty", () => {
    test("应该在对象中设置属性值", () => {
      const obj = { a: 1 };
      ObjectUtils.setProperty(obj, "a", 2);
      expect(obj.a).toBe(2);
    });
  });

  describe("createObject", () => {
    test("应该创建给定类型的实例", () => {
      class Test {
        constructor(public value: number) {}
      }
      const instance = ObjectUtils.createObject(Test, 10);
      expect(instance.value).toBe(10);
    });
    test("如果类型为null应该创建空对象", () => {
      const instance = ObjectUtils.createObject(null as any) as object;
      expect(Reflect.ownKeys(instance).length).toBe(0);
    });
  });

  describe("getDescendantProperty", () => {
    test("应该返回匹配的后代属性", () => {
      const obj = { p1: { p2: 1 } };
      expect(ObjectUtils.getDescendantProperty(obj, "p1", "p2")).toBe(1);
    });
    test("对不存在的属性应该返回undefined", () => {
      const obj = { p1: { p2: 1 } };
      expect(ObjectUtils.getDescendantProperty(obj, "p1", "p3")).toBeUndefined();
    });
    test("应该返回匹配的后代属性", () => {
      const obj = { p1: { p2: 1 } };
      expect(ObjectUtils.getDescendantProperty(obj.p1.p2)).toBe(1);
    });
    test("对null或undefined应该返回undefined", () => {
      expect(ObjectUtils.getDescendantProperty(undefined)).toBeUndefined();
      expect(ObjectUtils.getDescendantProperty(null)).toBeUndefined();
    });
  });

  describe("getOrDefault", () => {
    test("如果值存在应该返回该值", () => {
      const value = 1 as number;
      expect(ObjectUtils.getOrDefault(value, 0)).toBe(1);
    });
    test("对null应该返回默认值", () => {
      expect(ObjectUtils.getOrDefault(null, 0)).toBe(0);
    });
    test("对undefined应该返回默认值", () => {
      expect(ObjectUtils.getOrDefault(undefined, "1")).toBe("1");
    });
  });

  describe("hasValue", () => {
    test("对非null和非undefined值应该返回true", () => {
      expect(ObjectUtils.hasValue(1)).toBe(true);
      expect(ObjectUtils.hasValue("str")).toBe(true);
    });
    test("对null和undefined应该返回false", () => {
      expect(ObjectUtils.hasValue(undefined)).toBe(false);
      expect(ObjectUtils.hasValue(null)).toBe(false);
    });
  });
});
