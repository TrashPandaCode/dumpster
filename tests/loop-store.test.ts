/*
 * Authors: Jonathan Kron
 *
 * Purpose:
 * This file tests the `useLoopStore` Zustand store.
 * It verifies adding, removing, retrieving, persisting, and resetting loop handles, as well as proper initialization from and saving to `localStorage`.
 */
import { beforeEach, describe, expect, test } from "bun:test";

import { useLoopStore } from "~/lib/node-editor/node-store/loop-store";

describe("useLoopStore", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("level", "calculator");
    useLoopStore.getState().reset();
  });

  test("should initialize with empty loops", () => {
    const state = useLoopStore.getState();
    expect(state.loops.size).toBe(0);
  });

  test("should add handle to new loop", () => {
    const store = useLoopStore.getState();

    const handleId = store.addHandle("loop1", "input");

    expect(store.loops.has("loop1")).toBe(true);
    expect(store.loops.get("loop1")!.get("input")).toBe(handleId);
    expect(isUUIDv4WithoutDashes(store.loops.get("loop1")!.get("input")!)).toBe(
      true
    );
  });

  test("should add multiple handles to same loop", () => {
    const store = useLoopStore.getState();

    store.addHandle("loop1", "input");
    store.addHandle("loop1", "output");

    const loop = store.loops.get("loop1")!;
    expect(loop.size).toBe(2);
    expect(loop.has("input")).toBe(true);
    expect(loop.has("output")).toBe(true);
  });

  test("should not add duplicate handles with same label", () => {
    const store = useLoopStore.getState();

    store.addHandle("loop1", "input");
    store.addHandle("loop1", "input");

    const loop = store.loops.get("loop1")!;
    expect(loop.size).toBe(1);
  });

  test("should remove handle from loop", () => {
    const store = useLoopStore.getState();

    store.addHandle("loop1", "input");
    store.addHandle("loop1", "output");
    store.removeHandle("loop1", "input");

    const loop = store.loops.get("loop1")!;
    expect(loop.size).toBe(1);
    expect(loop.has("input")).toBe(false);
    expect(loop.has("output")).toBe(true);
  });

  test("should handle removing from non-existent loop", () => {
    const store = useLoopStore.getState();

    // Should not throw error
    store.removeHandle("non-existent", "input");

    expect(store.loops.size).toBe(0);
  });

  test("should get handles for loop", () => {
    const store = useLoopStore.getState();

    store.addHandle("loop1", "input");
    store.addHandle("loop1", "output");

    const handles = store.getHandles("loop1");

    expect(handles.size).toBe(2);
    expect(isUUIDv4WithoutDashes(handles.get("input")!)).toBe(true);
    expect(isUUIDv4WithoutDashes(handles.get("output")!)).toBe(true);
  });

  test("should return empty map for non-existent loop", () => {
    const store = useLoopStore.getState();

    const handles = store.getHandles("non-existent");

    expect(handles.size).toBe(0);
  });

  test("should save state to localStorage", () => {
    const store = useLoopStore.getState();

    store.addHandle("loop1", "input");
    store.addHandle("loop1", "output");
    store.addHandle("loop2", "data");
    store.save();

    const savedData = JSON.parse(
      localStorage.getItem("loop-store-calculator")!
    );

    expect(savedData).toBeDefined();
    expect(savedData.loops).toHaveLength(2);
    expect(savedData.loops[0][0]).toBe("loop1");
    expect(savedData.loops[0][1]).toHaveLength(2);
  });

  test("should initialize from localStorage", () => {
    // Setup localStorage data
    const testData = {
      loops: [
        [
          "loop1",
          [
            ["input", "handle1"],
            ["output", "handle2"],
          ],
        ],
        ["loop2", [["data", "handle3"]]],
      ],
    };
    localStorage.setItem("loop-store-calculator", JSON.stringify(testData));

    useLoopStore.getState().init();
    const state = useLoopStore.getState();

    expect(state.loops.size).toBe(2);
    expect(state.loops.get("loop1")!.get("input")).toBe("handle1");
    expect(state.loops.get("loop1")!.get("output")).toBe("handle2");
    expect(state.loops.get("loop2")!.get("data")).toBe("handle3");
  });

  test("should reset when no localStorage data exists", () => {
    useLoopStore.getState().addHandle("loop1", "input");
    expect(useLoopStore.getState().loops.size).toBe(1);

    useLoopStore.getState().init();

    expect(useLoopStore.getState().loops.size).toBe(0);
  });

  test("should reset loops to empty state", () => {
    useLoopStore.getState().addHandle("loop1", "input");
    useLoopStore.getState().addHandle("loop2", "output");
    expect(useLoopStore.getState().loops.size).toBe(2);

    useLoopStore.getState().reset();

    expect(useLoopStore.getState().loops.size).toBe(0);
  });
});

function isUUIDv4WithoutDashes(str: string): boolean {
  const regex =
    /^[0-9a-f]{8}[0-9a-f]{4}4[0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12}$/i;
  return regex.test(str);
}
