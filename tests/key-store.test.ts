import { beforeEach, describe, expect, it, jest } from "bun:test";

import { useKeyStore } from "~/lib/zustand/key";

describe("useKeyStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useKeyStore.setState({
      isKeyDown: () => false,
      isKeyPressed: () => false,
      isKeyReleased: () => false,
    });
  });

  it("should have initial state with false key states", () => {
    const store = useKeyStore.getState();
    expect(store.isKeyDown("a")).toBe(false);
    expect(store.isKeyPressed("space")).toBe(false);
    expect(store.isKeyReleased("enter")).toBe(false);
  });

  it("should set and use key down function", () => {
    const mockKeyDown = jest.fn((key: string) => key === "a");
    useKeyStore.getState().setKeyDownFunction(mockKeyDown);

    expect(useKeyStore.getState().isKeyDown("a")).toBe(true);
    expect(useKeyStore.getState().isKeyDown("b")).toBe(false);
    expect(mockKeyDown).toHaveBeenCalledTimes(2);
  });

  it("should set and use key pressed function", () => {
    const mockKeyPressed = jest.fn((key: string) => key === "space");
    useKeyStore.getState().setKeyPressedFunction(mockKeyPressed);

    expect(useKeyStore.getState().isKeyPressed("space")).toBe(true);
    expect(useKeyStore.getState().isKeyPressed("enter")).toBe(false);
  });

  it("should set and use key released function", () => {
    const mockKeyReleased = jest.fn((key: string) => key === "enter");
    useKeyStore.getState().setKeyReleasedFunction(mockKeyReleased);

    expect(useKeyStore.getState().isKeyReleased("enter")).toBe(true);
    expect(useKeyStore.getState().isKeyReleased("escape")).toBe(false);
  });
});
