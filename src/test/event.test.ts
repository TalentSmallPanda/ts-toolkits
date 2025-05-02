import EventUtils from "../utils/event.utils";

/**
 * @jest-environment jsdom
 */
describe("EventUtils", () => {
  // 测试元素和回调函数
  let target: HTMLElement;
  let callback: jest.Mock;
  // 添加委托测试用的子元素
  let childElement: HTMLElement;

  beforeEach(() => {
    // 创建测试DOM元素
    target = document.createElement("div");
    childElement = document.createElement("span");
    target.appendChild(childElement);
    document.body.appendChild(target);

    // 创建Jest模拟函数
    callback = jest.fn();
  });

  afterEach(() => {
    // 清理
    document.body.removeChild(target);
    jest.clearAllMocks();
  });

  describe("on", () => {
    it("应该绑定事件监听器并返回一个可以移除监听器的函数", () => {
      const removeListener = EventUtils.on(target, "click", callback);

      // 触发事件
      target.click();
      expect(callback).toHaveBeenCalledTimes(1);

      // 移除监听器
      removeListener();
      target.click();
      expect(callback).toHaveBeenCalledTimes(1); // 仍然是1，表示监听器已被移除
    });

    it("当传入无效参数时应返回空函数", () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      // 测试无效目标
      const removeListener1 = EventUtils.on(null as any, "click", callback);
      expect(consoleWarnSpy).toHaveBeenCalledWith("事件绑定参数无效");

      // 测试无效事件类型
      const removeListener2 = EventUtils.on(target, "", callback);
      expect(consoleWarnSpy).toHaveBeenCalledWith("事件绑定参数无效");

      // 测试无效回调函数
      const removeListener3 = EventUtils.on(target, "click", null as any);
      expect(consoleWarnSpy).toHaveBeenCalledWith("事件绑定参数无效");

      // 确保返回的都是空函数且可执行
      removeListener1();
      removeListener2();
      removeListener3();

      consoleWarnSpy.mockRestore();
    });
  });

  describe("off", () => {
    it("应该移除事件监听器", () => {
      // 先添加事件监听器
      target.addEventListener("click", callback);

      // 使用off方法移除
      const result = EventUtils.off(target, "click", callback);

      // 触发事件
      target.click();

      // 验证结果
      expect(result).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it("当传入无效参数时应返回false", () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      // 测试无效目标
      expect(EventUtils.off(null as any, "click", callback)).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith("移除事件监听器的参数无效");

      // 测试无效事件类型
      expect(EventUtils.off(target, "", callback)).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith("移除事件监听器的参数无效");

      // 测试无效回调函数
      expect(EventUtils.off(target, "click", null as any)).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith("移除事件监听器的参数无效");

      consoleWarnSpy.mockRestore();
    });
  });

  describe("emit", () => {
    it("应该分发自定义事件", () => {
      // 监听自定义事件
      target.addEventListener("customEvent", callback);

      // 分发事件
      const result = EventUtils.emit(target, "customEvent", { value: 123 });

      // 验证结果
      expect(result).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);

      // 验证事件对象包含了正确的detail
      const eventArg = callback.mock.calls[0][0] as CustomEvent;
      expect(eventArg.detail).toEqual({ value: 123 });
    });

    it("当传入无效参数时应返回false", () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      // 测试无效目标
      expect(EventUtils.emit(null as any, "customEvent")).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith("分发事件的参数无效");

      // 测试无效事件类型
      expect(EventUtils.emit(target, "")).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith("分发事件的参数无效");

      consoleWarnSpy.mockRestore();
    });
  });

  describe("once", () => {
    it("应该创建只执行一次的事件监听器", () => {
      // 添加一次性事件监听器
      EventUtils.once(target, "click", callback);

      // 第一次触发
      target.click();
      expect(callback).toHaveBeenCalledTimes(1);

      // 第二次触发，不应再执行
      target.click();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("delegate", () => {
    it("应该正确委托事件处理", () => {
      // 添加事件委托
      const removeDelegate = EventUtils.delegate(target, "span", "click", callback);

      // 点击子元素，回调应该被调用
      childElement.click();
      expect(callback).toHaveBeenCalledTimes(1);

      // 点击父元素，回调不应该被调用
      const event = new MouseEvent("click", {
        bubbles: false, // 防止冒泡到子元素
        cancelable: true,
      });
      target.dispatchEvent(event);
      expect(callback).toHaveBeenCalledTimes(1); // 仍然是1

      // 移除委托
      removeDelegate();
      childElement.click();
      expect(callback).toHaveBeenCalledTimes(1); // 仍然是1，表示已移除
    });

    it("当传入的target不是Element类型时应返回空函数", () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      // 使用非Element类型的目标
      const removeDelegate = EventUtils.delegate(window as any, "span", "click", callback);

      // 应该显示警告
      expect(consoleWarnSpy).toHaveBeenCalledWith("事件委托的目标必须是Element类型");

      // 返回的应该是可执行的空函数
      removeDelegate();

      consoleWarnSpy.mockRestore();
    });
  });

  describe("错误处理", () => {
    it("应该捕获并处理addEventListener的错误", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      // 模拟addEventListener抛出异常
      const originalAddEventListener = target.addEventListener;
      target.addEventListener = jest.fn().mockImplementation(() => {
        throw new Error("模拟错误");
      });

      // 调用on方法，不应该抛出异常
      const removeListener = EventUtils.on(target, "click", callback);

      // 验证错误被记录
      expect(consoleErrorSpy).toHaveBeenCalledWith("绑定事件监听器失败:", expect.any(Error));

      // 返回的应该是可执行的空函数
      removeListener();

      // 恢复原始方法
      target.addEventListener = originalAddEventListener;
      consoleErrorSpy.mockRestore();
    });

    it("应该捕获并处理removeEventListener的错误", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      // 正常添加事件监听器
      const removeListener = EventUtils.on(target, "click", callback);

      // 模拟removeEventListener抛出异常
      const originalRemoveEventListener = target.removeEventListener;
      target.removeEventListener = jest.fn().mockImplementation(() => {
        throw new Error("模拟错误");
      });

      // 调用返回的移除函数，不应该抛出异常
      removeListener();

      // 验证错误被记录
      expect(consoleErrorSpy).toHaveBeenCalledWith("移除事件监听器失败:", expect.any(Error));

      // 恢复原始方法
      target.removeEventListener = originalRemoveEventListener;
      consoleErrorSpy.mockRestore();
    });
  });
});
