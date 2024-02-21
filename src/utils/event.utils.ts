import ObjectUtils from "./object.utils";

export default class EventUtils {
  /**
   * Bind a listener event to the evt and return a destroyed event
   * @param evt
   * @param type
   * @param callback
   * @example EventUtils.on(document,"click",()=>{ console.log("click") })
   */
  public static on(evt: EventTarget, type: string, callback: (e) => void): () => void {
    evt.addEventListener(type, callback);
    return () => evt.removeEventListener(type, callback);
  }

  /**
   * Remove a listener event to the evt and return a destroyed event
   * @param evt
   * @param type
   * @param callback
   * @example EventUtils.off(document,"click",()=>{ console.log("click") })
   */
  public static off(evt: EventTarget, type: string, callback: () => void) {
    evt.removeEventListener(type, callback);
  }

  /**
   * Customize an event event and actively dispatch it
   * @param evt
   * @param type
   * @param data
   * @example EventUtils.emit(document,"msg-1", { datail: 123 })
   */
  public static emit(evt: EventTarget, type: string, data: any) {
    const event = new Event(type, {
      ...data,
    });
    if (ObjectUtils.hasValue(evt.dispatchEvent)) {
      evt.dispatchEvent(event);
    }
    // else {
    //   evt.fireEvent(myEvent);
    // }
  }
}
