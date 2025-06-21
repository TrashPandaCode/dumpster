import { beforeEach, describe, expect, it, jest } from "bun:test";
import type { Vec2 } from "kaplay";

import { useMouseStore } from "~/lib/zustand/mouse";

describe("useMouseStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMouseStore.setState({
      getMousePos: () => ({ x: 0, y: 0 }) as Vec2,
    });
  });

  it("should have initial mouse position at origin", () => {
    const pos = useMouseStore.getState().getMousePos();
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(0);
  });

  it("should set and use mouse position function", () => {
    const mockMousePos = jest.fn(() => ({ x: 100, y: 200 }) as Vec2);
    useMouseStore.getState().setMousePosFunction(mockMousePos);

    const pos = useMouseStore.getState().getMousePos();
    expect(pos.x).toBe(100);
    expect(pos.y).toBe(200);
    expect(mockMousePos).toHaveBeenCalledTimes(1);
  });

  it("should replace previous mouse position function", () => {
    const firstMockPos = jest.fn(() => ({ x: 50, y: 50 }) as Vec2);
    const secondMockPos = jest.fn(() => ({ x: 150, y: 150 }) as Vec2);

    useMouseStore.getState().setMousePosFunction(firstMockPos);
    useMouseStore.getState().setMousePosFunction(secondMockPos);

    const pos = useMouseStore.getState().getMousePos();
    expect(pos.x).toBe(150);
    expect(pos.y).toBe(150);
    expect(firstMockPos).not.toHaveBeenCalled();
    expect(secondMockPos).toHaveBeenCalledTimes(1);
  });
});
