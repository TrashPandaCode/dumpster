import { beforeEach, describe, expect, test } from "bun:test";

import { LEVELS } from "~/lib/game/core/levels";
import { useFlowStore } from "~/lib/node-editor/node-store/flow-store";

describe("useFlowStore", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("level", "calculator");
    useFlowStore.getState().reset("calculator");
  });

  test("should reset to initial level state", () => {
    const state = useFlowStore.getState();
    expect(state.nodes).toEqual(LEVELS["calculator"].initialNodes);
    expect(state.edges).toEqual([]);
    expect(state.highlightNodes.size).toBe(0);
  });

  test("should update nodes using setNodes", () => {
    const store = useFlowStore.getState();
    const testNode = {
      id: "1",
      type: "test",
      position: { x: 0, y: 0 },
      data: {},
    };

    store.setNodes(() => [testNode]);
    expect(useFlowStore.getState().nodes).toEqual([testNode]);
  });

  test("should update edges using setEdges", () => {
    const store = useFlowStore.getState();
    const testEdge = { id: "e1", source: "1", target: "2" };

    store.setEdges(() => [testEdge]);
    expect(useFlowStore.getState().edges).toEqual([testEdge]);
  });

  test("should highlight and reset node highlights", () => {
    const store = useFlowStore.getState();
    const testNode = {
      id: "1",
      type: "test",
      position: { x: 0, y: 0 },
      data: {},
      style: {},
    };

    store.setNodes(() => [testNode]);
    store.highlightNode("1", "cycle", "red");

    const highlightedState = useFlowStore.getState();
    expect(highlightedState.nodes[0].style!.outline).toBe("2px solid red");
    expect(highlightedState.highlightNodes.get("cycle")).toContain("1");

    store.resetHighlight("cycle");

    const resetState = useFlowStore.getState();
    expect(resetState.nodes[0].style!.outline).toBeUndefined();
    expect(resetState.highlightNodes.has("cycle")).toBe(false);
  });

  test("should save state to localStorage", () => {
    const store = useFlowStore.getState();
    const testNode = {
      id: "1",
      type: "test",
      position: { x: 0, y: 0 },
      data: {},
      selected: true,
      dragging: true,
    };

    store.setNodes(() => [testNode]);
    store.save();

    const savedData = JSON.parse(
      localStorage.getItem("flow-store-calculator")!
    );

    expect(savedData).toBeDefined();
    expect(savedData.nodes).toHaveLength(1);
    expect(savedData.nodes[0].selected || savedData.nodes[0].dragging).toBe(
      false
    );
    expect(savedData.edges).toBeInstanceOf(Array);
    expect(savedData.edges).toHaveLength(0);
    expect(savedData.highlightNodes).toBeInstanceOf(Array);
    expect(savedData.highlightNodes).toHaveLength(0);
  });
});
