import ObjectUtils from "./object.utils";

export default class HttpUtils {
  /**
   * 从cookie字符串中获取所有cookie值
   * @param cookie cookie字符串
   * @returns 解析后的cookie对象，键值对形式
   * @example HttpUtils.getCookies(document.cookie) // 返回 { "name": "value", ... }
   */
  public static getCookies(cookie: string): Record<string, string> {
    if (!ObjectUtils.isString(cookie) || cookie.trim() === "") {
      return {};
    }
    return this.getParams(cookie, "; ");
  }

  /**
   * 从URL中获取所有查询参数值
   * @param url URL字符串
   * @returns 解析后的查询参数对象，键值对形式
   * @example HttpUtils.getQueryParams("http://www.google.com/?search=test&id=123") // 返回 { "search": "test", "id": "123" }
   */
  public static getQueryParams(url: string): Record<string, string> {
    if (!ObjectUtils.isString(url)) {
      return {};
    }

    try {
      // 使用标准URL对象解析查询参数
      const urlObj = new URL(url.includes("://") ? url : `http://example.com/${url}`);
      const params: Record<string, string> = {};

      // 使用URLSearchParams迭代所有参数
      for (const [key, value] of urlObj.searchParams.entries()) {
        params[key] = value;
      }

      return params;
    } catch (error) {
      // 如果URL解析失败，回退到传统方法
      const queryIndex = url.indexOf("?");
      if (queryIndex === -1) {
        return {};
      }

      const queryString = url.substring(queryIndex + 1);
      return this.getParams(queryString, "&");
    }
  }

  /**
   * 获取URL的路径部分（不含协议、域名和查询参数）
   * @param url URL字符串
   * @returns URL的路径部分
   * @example HttpUtils.getPath("https://example.com/path/to/resource?query=1") // 返回 "/path/to/resource"
   */
  public static getPath(url: string): string {
    if (!ObjectUtils.isString(url)) {
      return "";
    }

    try {
      const urlObj = new URL(url.includes("://") ? url : `http://example.com/${url}`);
      return urlObj.pathname;
    } catch (error) {
      // 如果URL解析失败，尝试简单解析
      const queryIndex = url.indexOf("?");
      if (queryIndex !== -1) {
        url = url.substring(0, queryIndex);
      }

      const pathStartIndex = url.indexOf("/", url.indexOf("://") + 3);
      return pathStartIndex !== -1 ? url.substring(pathStartIndex) : "/";
    }
  }

  /**
   * 解析参数字符串，格式如：a=1[分隔符]b=2[分隔符]c=3
   * @param paramStr 参数字符串
   * @param splitChar 分隔字符
   * @returns 解析后的参数对象
   * @private
   */
  private static getParams(paramStr: string, splitChar: string): Record<string, string> {
    const result: Record<string, string> = {};
    if (!ObjectUtils.isString(paramStr) || !ObjectUtils.isString(splitChar) || paramStr.trim() === "") {
      return result;
    }

    const parts = paramStr.split(splitChar);
    for (const part of parts) {
      const firstEqualIndex = part.indexOf("=");
      if (firstEqualIndex > 0) {
        // 解码键和值
        try {
          const key = decodeURIComponent(part.substring(0, firstEqualIndex).trim());
          const value = decodeURIComponent(part.substring(firstEqualIndex + 1).trim());
          result[key] = value;
        } catch (e) {
          // 解码失败时使用原始值
          const key = part.substring(0, firstEqualIndex).trim();
          const value = part.substring(firstEqualIndex + 1).trim();
          result[key] = value;
        }
      } else if (part.trim()) {
        // 处理没有等号的参数，将其视为标志参数
        const key = part.trim();
        result[key] = "true";
      }
    }
    return result;
  }

  /**
   * 将对象转换为URL查询字符串
   * @param params 要转换的参数对象
   * @param encodeValues 是否对值进行URL编码
   * @returns 格式化的查询字符串（不包含前缀问号）
   * @example HttpUtils.toQueryString({name: "test", id: 123}) // 返回 "name=test&id=123"
   */
  public static toQueryString(params: Record<string, any>, encodeValues = true): string {
    if (!ObjectUtils.hasValue(params) || typeof params !== "object") {
      return "";
    }

    return Object.entries(params)
      .filter(([_, value]) => value != null) // 过滤空值
      .map(([key, value]) => {
        const valueStr = typeof value === "object" ? JSON.stringify(value) : String(value);
        return `${key}=${encodeValues ? encodeURIComponent(valueStr) : valueStr}`;
      })
      .join("&");
  }

  /**
   * 组合基础URL和相对路径
   * @param baseUrl 基础URL
   * @param path 相对路径
   * @returns 组合后的URL
   * @example HttpUtils.combineUrl("https://api.example.com", "/users") // 返回 "https://api.example.com/users"
   */
  public static combineUrl(baseUrl: string, path: string): string {
    if (!baseUrl) return path || "";
    if (!path) return baseUrl;

    const hasEndingSlash = baseUrl.endsWith("/");
    const hasStartingSlash = path.startsWith("/");

    if (hasEndingSlash && hasStartingSlash) {
      return baseUrl + path.substring(1);
    } else if (!hasEndingSlash && !hasStartingSlash) {
      return `${baseUrl}/${path}`;
    } else {
      return baseUrl + path;
    }
  }
}
