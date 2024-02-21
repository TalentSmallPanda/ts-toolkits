import EventUtils from "../utils/event.utils";

describe("EventUtils", () => {
  let target: HTMLElement;
  let callback: jest.Mock;

  beforeEach(() => {
    target = document.createElement("div");
    callback = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("on", () => {
    it("should bind a listener event and return a function to remove the listener", () => {
      const removeListener = EventUtils.on(target, "click", callback);
      target.click();
      expect(callback).toHaveBeenCalledTimes(1);
      removeListener();
      target.click();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("off", () => {
    it("should remove a listener event", () => {
      target.addEventListener("click", callback);
      EventUtils.off(target, "click", callback);
      target.click();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("emit", () => {
    it("should dispatch a custom event", () => {
      const eventData = { detail: 123 };
      EventUtils.emit(target, "customEvent", eventData);
      expect(callback).not.toHaveBeenCalled(); // The callback should not be called directly
      const dispatchedEvent = new CustomEvent("customEvent", eventData);
      expect(target.dispatchEvent).toHaveBeenCalledWith(dispatchedEvent);
    });
  });
});
