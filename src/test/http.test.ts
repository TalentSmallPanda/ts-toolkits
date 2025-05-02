import HttpUtils from "../utils/http.utils";

const nullStr = null as unknown as string;
const ufdStr = undefined as unknown as string;

describe("HttpUtils", () => {
  describe("getCookies", () => {
    test("应该为空cookie字符串返回空对象", () => {
      expect(HttpUtils.getCookies("")).toEqual({});
    });

    test("应该正确解析cookies", () => {
      const cookieString = "name=John Doe; id=123; theme=light";
      const expected = {
        name: "John Doe",
        id: "123",
        theme: "light",
      };
      expect(HttpUtils.getCookies(cookieString)).toEqual(expected);
    });

    test("应该处理没有值的cookies", () => {
      const cookieString = "name=; id=123";
      const expected = {
        name: "",
        id: "123",
      };
      expect(HttpUtils.getCookies(cookieString)).toEqual(expected);
    });

    test("应该将没有等号的参数视为标志参数", () => {
      const cookieString = "name=John Doe; id; theme=light";
      const expected = {
        name: "John Doe",
        id: "true",
        theme: "light",
      };
      expect(HttpUtils.getCookies(cookieString)).toEqual(expected);
    });

    test("应该处理编码的cookies值", () => {
      const cookieString = "name=John%20Doe; message=%E4%BD%A0%E5%A5%BD";
      const expected = {
        name: "John Doe",
        message: "你好",
      };
      expect(HttpUtils.getCookies(cookieString)).toEqual(expected);
    });

    test("应该处理非字符串输入", () => {
      expect(HttpUtils.getCookies(nullStr)).toEqual({});
      expect(HttpUtils.getCookies(ufdStr)).toEqual({});
    });

    test("应该处理URL解码失败", () => {
      const cookieString = "name=John%2G; id=123";
      const expected = {
        name: "John%2G",
        id: "123",
      };
      expect(HttpUtils.getCookies(cookieString)).toEqual(expected);
    });
  });

  describe("getQueryParams", () => {
    test("应该为非字符串URL返回空对象", () => {
      expect(HttpUtils.getQueryParams(nullStr)).toEqual({});
      expect(HttpUtils.getQueryParams("123")).toEqual({});
      expect(HttpUtils.getQueryParams(ufdStr)).toEqual({});
    });

    test("应该在没有查询参数时返回空对象", () => {
      const url = "http://www.google.com/";
      expect(HttpUtils.getQueryParams(url)).toEqual({});
    });

    test("应该正确解析查询参数", () => {
      const url = "http://www.google.com/?search=test&id=123";
      const expected = {
        search: "test",
        id: "123",
      };
      expect(HttpUtils.getQueryParams(url)).toEqual(expected);
    });

    test("应该处理没有值的查询参数", () => {
      const url = "http://www.google.com/?search=&id=123";
      const expected = {
        search: "",
        id: "123",
      };
      expect(HttpUtils.getQueryParams(url)).toEqual(expected);
    });

    test("应该处理没有等号的参数", () => {
      const url = "http://www.google.com/?search=test&id";
      const expected = {
        search: "test",
        id: "",
      };
      expect(HttpUtils.getQueryParams(url)).toEqual(expected);
    });

    test("应该处理无效URL并回退到传统方法", () => {
      const url = "::invalid-url::?param=value";
      const expected = {
        param: "value",
      };
      expect(HttpUtils.getQueryParams(url)).toEqual(expected);
    });

    test("应该处理没有查询字符串的无效URL", () => {
      const url = "::invalid-url::";
      expect(HttpUtils.getQueryParams(url)).toEqual({});
    });

    test("应该处理复杂URL", () => {
      const url = "https://example.com/path?name=John%20Doe&age=30&filter[]=a&filter[]=b";
      const result = HttpUtils.getQueryParams(url);
      expect(result.name).toBe("John Doe");
      expect(result.age).toBe("30");
      expect(result["filter[]"]).toBe("b");
    });

    test("应该处理相对URL路径", () => {
      const url = "/search?q=test&page=2";
      const expected = {
        q: "test",
        page: "2",
      };
      expect(HttpUtils.getQueryParams(url)).toEqual(expected);
    });
  });

  describe("getPath", () => {
    test("应该正确提取URL的路径部分", () => {
      expect(HttpUtils.getPath("https://example.com/path/to/resource")).toBe("/path/to/resource");
      expect(HttpUtils.getPath("https://example.com")).toBe("/");
      expect(HttpUtils.getPath("https://example.com/")).toBe("/");
    });

    test("应该正确处理带查询参数的URL", () => {
      expect(HttpUtils.getPath("https://example.com/path?query=test")).toBe("/path");
      expect(HttpUtils.getPath("https://example.com/users/123?details=true")).toBe("/users/123");
    });

    test("应该正确处理相对路径", () => {
      const relativePath = HttpUtils.getPath("/users/profile");
      expect(relativePath).toMatch(/^\/*users\/profile$/);

      const noLeadingSlashPath = HttpUtils.getPath("users/profile");
      expect(noLeadingSlashPath).toMatch(/^\/*users\/profile$/);
    });

    test("应该处理非字符串输入", () => {
      expect(HttpUtils.getPath(nullStr)).toBe("");
      expect(HttpUtils.getPath(ufdStr)).toBe("");
    });

    test("应该处理空字符串", () => {
      const result = HttpUtils.getPath("");
      expect(result === "" || result === "/").toBeTruthy();
    });

    test("应该处理URL解析失败的情况", () => {
      const url = "::invalid-url::";
      const result = HttpUtils.getPath(url);
      expect(result).toBeDefined();
    });

    test("应该处理没有协议的URL", () => {
      const url = "example.com/path";
      const result = HttpUtils.getPath(url);
      expect(result).toBe("/example.com/path");
    });
  });

  describe("toQueryString", () => {
    test("应该将对象转换为查询字符串", () => {
      const params = {
        name: "John Doe",
        age: 30,
        active: true,
      };
      expect(HttpUtils.toQueryString(params)).toBe("name=John%20Doe&age=30&active=true");
    });

    test("应该处理空对象", () => {
      expect(HttpUtils.toQueryString({})).toBe("");
    });

    test("应该过滤null和undefined值", () => {
      const params = {
        name: "John",
        age: null,
        city: undefined,
        active: true,
      };
      expect(HttpUtils.toQueryString(params)).toBe("name=John&active=true");
    });

    test("应该正确处理数组和对象值", () => {
      const params = {
        tags: ["javascript", "typescript"],
        user: { id: 123, name: "John" },
      };
      const result = HttpUtils.toQueryString(params);
      expect(result).toContain("tags=");
      expect(result).toContain("user=");
      expect(result).toContain("%5B%22javascript%22%2C%22typescript%22%5D");
    });

    test("应该支持禁用值编码", () => {
      const params = {
        name: "John Doe",
        tags: ["a", "b"],
      };
      const result = HttpUtils.toQueryString(params, false);
      expect(result).toContain("name=John Doe");
      expect(result).toContain('tags=["a","b"]');
    });

    test("应该处理非对象参数", () => {
      expect(HttpUtils.toQueryString(null as any)).toBe("");
      expect(HttpUtils.toQueryString(undefined as any)).toBe("");
      expect(HttpUtils.toQueryString("string" as any)).toBe("");
      expect(HttpUtils.toQueryString(123 as any)).toBe("");
      expect(HttpUtils.toQueryString([] as any)).toBe("");
    });

    test("应该处理零值和空字符串", () => {
      const params = {
        count: 0,
        empty: "",
        falseVal: false,
      };
      expect(HttpUtils.toQueryString(params)).toBe("count=0&empty=&falseVal=false");
    });
  });

  describe("combineUrl", () => {
    test("应该正确组合基础URL和路径", () => {
      expect(HttpUtils.combineUrl("https://api.example.com", "/users")).toBe("https://api.example.com/users");
      expect(HttpUtils.combineUrl("https://api.example.com/", "users")).toBe("https://api.example.com/users");
      expect(HttpUtils.combineUrl("https://api.example.com", "users")).toBe("https://api.example.com/users");
      expect(HttpUtils.combineUrl("https://api.example.com/", "/users")).toBe("https://api.example.com/users");
    });

    test("应该处理空路径", () => {
      expect(HttpUtils.combineUrl("https://api.example.com", "")).toBe("https://api.example.com");
      expect(HttpUtils.combineUrl("", "/users")).toBe("/users");
      expect(HttpUtils.combineUrl("", "")).toBe("");
    });

    test("应该处理空的baseUrl", () => {
      expect(HttpUtils.combineUrl(nullStr, "/users")).toBe("/users");
      expect(HttpUtils.combineUrl(ufdStr, "/users")).toBe("/users");
    });

    test("应该处理空的path", () => {
      expect(HttpUtils.combineUrl("https://api.example.com", nullStr)).toBe("https://api.example.com");
      expect(HttpUtils.combineUrl("https://api.example.com", ufdStr)).toBe("https://api.example.com");
    });

    test("应该处理路径中的多余斜杠", () => {
      expect(HttpUtils.combineUrl("https://api.example.com/", "/users/")).toBe("https://api.example.com/users/");
      expect(HttpUtils.combineUrl("https://api.example.com//", "//users")).toBe("https://api.example.com///users");
    });

    test("应该保留查询参数", () => {
      expect(HttpUtils.combineUrl("https://api.example.com", "/users?id=123")).toBe(
        "https://api.example.com/users?id=123"
      );
      expect(HttpUtils.combineUrl("https://api.example.com?version=1", "/users")).toBe(
        "https://api.example.com?version=1/users"
      );
    });
  });

  describe("getParams (通过公共API间接测试)", () => {
    test("应该处理带特殊字符的参数", () => {
      const queryString = "q=search+term&special=!@%23%24%25";
      const url = `http://example.com/?${queryString}`;
      const expected = {
        q: "search term",
        special: "!@#$%",
      };
      expect(HttpUtils.getQueryParams(url)).toEqual(expected);
    });

    test("应该处理重复参数", () => {
      const cookieString = "name=John; name=Jane; id=123";
      const expected = {
        name: "Jane",
        id: "123",
      };
      expect(HttpUtils.getCookies(cookieString)).toEqual(expected);
    });

    test("应该处理带有等号的值", () => {
      const url = "http://example.com/?equation=a=b+c&id=123";
      const expected = {
        equation: "a=b c",
        id: "123",
      };
      expect(HttpUtils.getQueryParams(url)).toEqual(expected);
    });
  });

  describe("集成测试", () => {
    test("应该支持生成查询字符串、组合URL并解析路径和参数", () => {
      const baseUrl = "https://api.example.com";
      const path = "/search";
      const params = {
        q: "test query",
        page: 1,
        filters: ["active", "recent"],
      };

      const queryString = HttpUtils.toQueryString(params);

      const fullPathWithQuery = `${path}?${queryString}`;
      const fullUrl = HttpUtils.combineUrl(baseUrl, fullPathWithQuery);

      const extractedPath = HttpUtils.getPath(fullUrl);
      expect(extractedPath).toBe("/search");

      const parsedQueryParams = HttpUtils.getQueryParams(fullUrl);
      expect(parsedQueryParams.q).toBe("test query");
      expect(parsedQueryParams.page).toBe("1");
      expect(parsedQueryParams.filters).toBeDefined();
    });

    test("应该支持URL组合和路径提取", () => {
      const baseUrl = "https://api.example.com";
      const path = "/users/profile";

      const fullUrl = HttpUtils.combineUrl(baseUrl, path);
      expect(fullUrl).toBe("https://api.example.com/users/profile");

      const extractedPath = HttpUtils.getPath(fullUrl);
      expect(extractedPath).toBe("/users/profile");
    });
  });
});
