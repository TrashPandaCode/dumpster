import { beforeEach, describe, expect, it, jest, spyOn } from "bun:test";

import { LEVELS, type LevelId } from "~/lib/game/core/levels";
import {
  createLevelDataHelpers,
  HandleData,
  useDataStore,
} from "~/lib/zustand/data";

describe("HandleData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create HandleData with number value", () => {
    const handle = new HandleData("import", 42);
    expect(handle.access).toBe("import");
    expect(handle.getValue()).toBe(42);
  });

  it("should create HandleData with function value", () => {
    const mockFn = jest.fn(() => 100);
    const handle = new HandleData("export", mockFn);
    expect(handle.access).toBe("export");
    expect(handle.getValue()).toBe(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should return 0 for invalid value types", () => {
    const handle = new HandleData("all", "invalid" as any);
    expect(handle.getValue()).toBe(0);
  });

  it("should update value with setValue", () => {
    const handle = new HandleData("import", 10);
    handle.setValue(20);
    expect(handle.getValue()).toBe(20);

    const mockFn = jest.fn(() => 30);
    handle.setValue(mockFn);
    expect(handle.getValue()).toBe(30);
  });
});

describe("useDataStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Reset the store state
    useDataStore.setState({
      initData: true,
      gameObjects: new Map(),
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      expect(useDataStore.getState().initData).toBe(true);
      expect(useDataStore.getState().gameObjects).toBeInstanceOf(Map);
      expect(useDataStore.getState().gameObjects.size).toBe(0);
    });
  });

  describe("reset", () => {
    it("should reset store with level data for all levels", () => {
      // Test each level in LEVELS
      Object.entries(LEVELS).forEach(([_, level]) => {
        // Reset store for current level
        useDataStore.getState().reset(level.slug);

        // Verify basic store state
        expect(useDataStore.getState().initData).toBe(true);
        expect(useDataStore.getState().gameObjects.size).toBe(
          level.modifiableGameObjects.length
        );

        // Test each modifiable game object in the level
        level.modifiableGameObjects.forEach((modifiableGameObject) => {
          const gameObjectData = useDataStore
            .getState()
            .gameObjects.get(modifiableGameObject.id);

          // Verify game object exists in store
          expect(gameObjectData).toBeDefined();

          expect(gameObjectData!.size).toBe(
            modifiableGameObject.connections.length
          );

          // Test each connection for the game object
          modifiableGameObject.connections.forEach((connection) => {
            // Verify connection exists
            expect(gameObjectData!.has(connection.label)).toBe(true);

            const handleData = gameObjectData!.get(connection.label);

            // Verify handle data properties
            expect(handleData).toBeInstanceOf(HandleData);
            expect(handleData!.access).toBe(connection.access);
            expect(handleData!.getValue()).toBe(0);
          });
        });
      });
    });
  });

  describe("setData and getData", () => {
    beforeEach(() => {
      useDataStore.getState().reset("calculator");
    });

    it("should set and get numeric data", () => {
      useDataStore.getState().setData("raccoon", "solution", 42);

      const value = useDataStore.getState().getData("raccoon", "solution");
      expect(value).toBe(42);
    });

    it("should set and get function data", () => {
      const mockFn = jest.fn(() => 100);

      useDataStore.getState().setData("raccoon", "solution", mockFn);

      const value = useDataStore.getState().getData("raccoon", "solution");
      expect(value).toBe(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("addHandle and removeHandle", () => {
    beforeEach(() => {
      useDataStore.getState().reset("calculator");
    });

    it("should add new handle", () => {
      useDataStore.getState().addHandle("raccoon", "newHandle");

      const gameObject1Data = useDataStore
        .getState()
        .gameObjects.get("raccoon");
      expect(gameObject1Data!.has("newHandle")).toBe(true);

      const newHandle = gameObject1Data!.get("newHandle");
      expect(newHandle).toBeInstanceOf(HandleData);
      expect(newHandle!.access).toBe("all");
      expect(newHandle!.getValue()).toBe(0);
    });

    it("should not add duplicate handle", () => {
      const initialSize = useDataStore
        .getState()
        .gameObjects.get("raccoon")!.size;

      useDataStore.getState().addHandle("raccoon", "solution"); // existing handle

      const finalSize = useDataStore
        .getState()
        .gameObjects.get("raccoon")!.size;
      expect(finalSize).toBe(initialSize);
    });

    it("should remove handle", () => {
      useDataStore.getState().addHandle("raccoon", "newHandle");
      useDataStore.getState().removeHandle("raccoon", "newHandle");

      const gameObject1Data = useDataStore
        .getState()
        .gameObjects.get("raccoon");
      expect(gameObject1Data!.has("newHandle")).toBe(false);
      expect(gameObject1Data!.size).toBe(1); // should have only solution left
    });
  });

  describe("save and init", () => {
    beforeEach(() => {
      localStorage.clear();
      localStorage.setItem("level", "calculator");
      useDataStore.getState().reset("calculator");
    });

    it("should save store state to localStorage", () => {
      const store = useDataStore.getState();

      store.reset(localStorage.getItem("level")! as LevelId);
      store.setData("raccoon", "solution", 42);

      store.save();

      // Verify the saved data structure
      const savedData = JSON.parse(
        localStorage.getItem("data-store-calculator")!
      );
      expect(savedData).toBeDefined();
      expect(savedData.initData).toBe(true);
      expect(savedData.gameObjects).toBeInstanceOf(Array);
      expect(savedData.gameObjects).toHaveLength(
        LEVELS.calculator.modifiableGameObjects.length
      );
    });

    it("should initialize from localStorage when data exists", () => {
      // Prepare saved data
      const savedData = {
        initData: false,
        gameObjects: [
          ["raccoon", [["solution", { access: "export", value: 42 }]]],
        ],
      };

      localStorage.setItem("data-store-calculator", JSON.stringify(savedData));

      useDataStore.getState().init("calculator");
      // getState returns a snapshop of the store, so it needs to be called again after the store is modified
      const store = useDataStore.getState();

      expect(store.initData).toBe(false);
      expect(store.gameObjects.size).toBe(
        LEVELS.calculator.modifiableGameObjects.length
      );
      expect(store.gameObjects.has("raccoon")).toBe(true);
      expect(store.gameObjects.get("raccoon")!.get("solution")?.access).toEqual(
        "export"
      );
      expect(store.getData("raccoon", "solution")).toBe(42);
    });

    it("should reset when no saved data exists", () => {
      const store = useDataStore.getState();
      const resetSpy = spyOn(store, "reset");

      store.init("calculator");

      expect(resetSpy).toHaveBeenCalledWith("calculator");
    });
  });
});

describe("createLevelDataHelpers", () => {
  beforeEach(() => {
    localStorage.clear();
    useDataStore.getState().reset("calculator");
  });

  it("should create type-safe helpers for a specific level", () => {
    const helpers = createLevelDataHelpers("calculator");

    expect(helpers.initData()).toBe(true);
    expect(typeof helpers.setData).toBe("function");
    expect(typeof helpers.getData).toBe("function");
    expect(typeof helpers.addHandle).toBe("function");
    expect(typeof helpers.removeHandle).toBe("function");
  });

  it("should provide working setData and getData methods", () => {
    const helpers = createLevelDataHelpers("calculator");

    // These calls should be type-safe based on the level configuration
    helpers.setData("raccoon", "solution", 42);
    const value = helpers.getData("raccoon", "solution");

    expect(value).toBe(42);
  });
});

describe("integration tests", () => {
  it("should handle complete workflow: reset -> modify -> save -> init", () => {
    localStorage.clear();
    localStorage.setItem("level", "calculator");
    let store = useDataStore.getState();

    // Reset with level data
    store.reset("calculator");

    // Modify data
    store.setData("raccoon", "solution", 42);
    store.addHandle("raccoon", "customHandle");
    store.setData("raccoon", "customHandle", 100);

    // Save
    store.save();

    // Clear store
    useDataStore.setState({
      initData: true,
      gameObjects: new Map(),
    });

    // Initialize from saved data
    store.init("calculator");

    store = useDataStore.getState();

    // Verify data persistence (note: values are reset to 0 in init due to HandleData constructor)
    expect(store.gameObjects.get("raccoon")!.has("customHandle")).toBe(true);
    expect(store.getData("raccoon", "customHandle")).toBe(100);
    expect(store.gameObjects.get("raccoon")!.has("solution")).toBe(true);
    expect(store.getData("raccoon", "solution")).toBe(42);
  });
});
