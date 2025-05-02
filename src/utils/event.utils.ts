import ObjectUtils from "./object.utils";

const noop = () => {
  /* 空函数 */
};

export default class EventUtils {
  /**
   * 为事件目标绑定监听器并返回一个销毁事件的函数
   * @param target 事件目标
   * @param type 事件类型
   * @param callback 回调函数
   * @param options 事件监听选项
   * @returns 用于移除事件监听器的函数
   * @example EventUtils.on(document,"click",(e) => { console.log("点击位置:", e.clientX, e.clientY) })
   * @example const destroy = EventUtils.on(document,"scroll",(e) => {}, { passive: true }); destroy();
   */
  public static on(
    target: EventTarget,
    type: string,
    callback: (event: Event) => void,
    options?: boolean | AddEventListenerOptions
  ): () => void {
    if (!ObjectUtils.hasValue(target) || !type || typeof callback !== "function") {
      console.warn("事件绑定参数无效");
      return noop; // 返回共享的空函数
    }

    try {
      target.addEventListener(type, callback, options);
      return () => {
        try {
          target.removeEventListener(type, callback, options);
        } catch (error) {
          console.error("移除事件监听器失败:", error);
        }
      };
    } catch (error) {
      console.error("绑定事件监听器失败:", error);
      return noop; // 返回共享的空函数
    }
  }

  /**
   * 从事件目标上移除监听器
   * @param target 事件目标
   * @param type 事件类型
   * @param callback 回调函数
   * @param options 事件监听选项
   * @returns 是否成功移除监听器
   * @example EventUtils.off(document,"click",handleClick)
   */
  public static off(
    target: EventTarget,
    type: string,
    callback: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): boolean {
    if (!ObjectUtils.hasValue(target) || !type || typeof callback !== "function") {
      console.warn("移除事件监听器的参数无效");
      return false;
    }

    try {
      target.removeEventListener(type, callback, options);
      return true;
    } catch (error) {
      console.error("移除事件监听器失败:", error);
      return false;
    }
  }

  /**
   * 创建自定义事件并主动触发它
   * @param target 事件目标
   * @param type 事件类型
   * @param detail 事件详情数据
   * @param options 自定义事件选项
   * @returns 事件是否成功分发
   * @example EventUtils.emit(document,"message", { id: 123, content: "测试消息" })
   */
  public static emit(target: EventTarget, type: string, detail?: any, options?: CustomEventInit): boolean {
    if (!ObjectUtils.hasValue(target) || !type) {
      console.warn("分发事件的参数无效");
      return false;
    }

    try {
      const eventOptions: CustomEventInit = {
        detail,
        bubbles: true,
        cancelable: true,
        ...options,
      };

      const event = new CustomEvent(type, eventOptions);

      return target.dispatchEvent(event);
    } catch (error) {
      console.error("分发事件失败:", error);
      return false;
    }
  }

  /**
   * 创建一个只执行一次的事件监听器
   * @param target 事件目标
   * @param type 事件类型
   * @param callback 回调函数
   * @param options 事件监听选项
   * @returns 用于移除事件监听器的函数
   * @example EventUtils.once(document,"click",(e) => { console.log("只执行一次的点击事件") })
   */
  public static once(
    target: EventTarget,
    type: string,
    callback: (event: Event) => void,
    options?: Omit<AddEventListenerOptions, "once">
  ): () => void {
    return this.on(target, type, callback, { ...options, once: true });
  }

  /**
   * 委托事件处理（事件代理）
   * @param target 事件目标（父元素）
   * @param selector CSS选择器
   * @param type 事件类型
   * @param callback 回调函数
   * @param options 事件监听选项
   * @returns 用于移除事件委托的函数
   * @example EventUtils.delegate(document.querySelector('ul'), 'li', 'click', (e) => { console.log('点击了列表项:', e.target) })
   */
  public static delegate(
    target: EventTarget,
    selector: string,
    type: string,
    callback: (event: Event) => void,
    options?: boolean | AddEventListenerOptions
  ): () => void {
    if (!(target instanceof Element)) {
      console.warn("事件委托的目标必须是Element类型");
      return noop; // 返回共享的空函数
    }

    const delegateCallback = (event: Event) => {
      const path = event.composedPath();
      for (const element of path) {
        if (!(element instanceof Element)) continue;

        if (element.matches(selector)) {
          // 调用回调并绑定正确的this
          callback.call(element, event);
          break;
        }
      }
    };

    return this.on(target, type, delegateCallback, options);
  }
}
