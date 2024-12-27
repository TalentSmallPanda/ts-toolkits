import HttpUtils from "../utils/http.utils";

const nullStr = null as unknown as string;
const ufdStr = undefined as unknown as string;

describe("HttpUtils", () => {
  describe("getCookies", () => {
    test("should return an empty object for an empty cookie string", () => {
      expect(HttpUtils.getCookies("")).toEqual({});
    });

    test("should parse cookies correctly", () => {
      const cookieString = "name=John Doe; id=123; theme=light";
      const expected = {
        name: "John Doe",
        id: "123",
        theme: "light",
      };
      expect(HttpUtils.getCookies(cookieString)).toEqual(expected);
    });

    test("should handle cookies with no value", () => {
      const cookieString = "name=; id=123";
      const expected = {
        name: "",
        id: "123",
      };
      expect(HttpUtils.getCookies(cookieString)).toEqual(expected);
    });

    test("should ignore malformed cookies", () => {
      const cookieString = "name=John Doe; id; theme=light";
      const expected = {
        name: "John Doe",
        theme: "light",
      };
      expect(HttpUtils.getCookies(cookieString)).toEqual(expected);
    });
  });

  describe("getQueryParams", () => {
    test("should return an empty object for a non-string URL", () => {
      expect(HttpUtils.getQueryParams(nullStr)).toEqual({});
      expect(HttpUtils.getQueryParams("123")).toEqual({});
      expect(HttpUtils.getQueryParams(ufdStr)).toEqual({});
    });

    test("should return an empty object if there are no query parameters", () => {
      const url = "http://www.google.com/";
      expect(HttpUtils.getQueryParams(url)).toEqual({});
    });

    test("should parse query parameters correctly", () => {
      const url = "http://www.google.com/?search=test&id=123";
      const expected = {
        search: "test",
        id: "123",
      };
      expect(HttpUtils.getQueryParams(url)).toEqual(expected);
    });

    test("should handle query parameters without values", () => {
      const url = "http://www.google.com/?search=&id=123";
      const expected = {
        search: "",
        id: "123",
      };
      expect(HttpUtils.getQueryParams(url)).toEqual(expected);
    });

    test("should ignore malformed query parameters", () => {
      const url = "http://www.google.com/?search=test&id";
      const expected = {
        search: "test",
      };
      expect(HttpUtils.getQueryParams(url)).toEqual(expected);
    });
  });
});
