/*
 * Authors: Jonathan Kron
 *
 * Purpose:
 * This file tests the `useTimeStore` Zustand store.
 * It verifies that initial values are zero, custom functions can be set, and previously set functions are properly replaced.
 */
import { beforeEach, describe, expect, jest, test } from "bun:test";

import { useTimeStore } from "~/lib/zustand/time";

describe("useTimeStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTimeStore.setState({
      getTime: () => 0,
      getDeltaTime: () => 0,
    });
  });

  test("should have initial time values of 0", () => {
    const store = useTimeStore.getState();
    expect(store.getTime()).toBe(0);
    expect(store.getDeltaTime()).toBe(0);
  });

  test("should set and use time function", () => {
    const mockTime = jest.fn(() => 1000);
    useTimeStore.getState().setTimeFunction(mockTime);

    expect(useTimeStore.getState().getTime()).toBe(1000);
    expect(mockTime).toHaveBeenCalledTimes(1);
  });

  test("should set and use delta time function", () => {
    const mockDeltaTime = jest.fn(() => 16.67);
    useTimeStore.getState().setDeltaTimeFunction(mockDeltaTime);

    expect(useTimeStore.getState().getDeltaTime()).toBe(16.67);
    expect(mockDeltaTime).toHaveBeenCalledTimes(1);
  });

  test("should replace previous time functions", () => {
    const firstMockTime = jest.fn(() => 500);
    const secondMockTime = jest.fn(() => 2000);

    useTimeStore.getState().setTimeFunction(firstMockTime);
    useTimeStore.getState().setTimeFunction(secondMockTime);

    expect(useTimeStore.getState().getTime()).toBe(2000);
    expect(firstMockTime).not.toHaveBeenCalled();
    expect(secondMockTime).toHaveBeenCalledTimes(1);
  });
});
