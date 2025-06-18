import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

import { LEVELS, type LevelId } from "../app/lib/game/core/levels";
import {
  createLevelDataHelpers,
  HandleData,
  useDataStore,
} from "../app/lib/zustand/data";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: 0,
    key: jest.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };
})();

global.localStorage = localStorageMock;

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
    localStorageMock.clear();

    // Reset the store state
    useDataStore.setState({
      initData: true,
      gameObjects: new Map(),
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const { result } = renderHook(() => useDataStore());

      expect(result.current.initData).toBe(true);
      expect(result.current.gameObjects).toBeInstanceOf(Map);
      expect(result.current.gameObjects.size).toBe(0);
    });
  });

  describe("reset", () => {
    it("should reset store with level data for all levels", () => {
      const { result } = renderHook(() => useDataStore());

      // Test each level in LEVELS
      Object.entries(LEVELS).forEach(([_, level]) => {
        // Reset store for current level
        act(() => {
          result.current.reset(level.slug);
        });

        // Verify basic store state
        expect(result.current.initData).toBe(true);
        expect(result.current.gameObjects.size).toBe(
          level.modifiableGameObjects.length
        );

        // Test each modifiable game object in the level
        level.modifiableGameObjects.forEach((modifiableGameObject) => {
          const gameObjectData = result.current.gameObjects.get(
            modifiableGameObject.id
          );

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
      const { result } = renderHook(() => useDataStore());
      act(() => {
        result.current.reset("calculator");
      });
    });

    it("should set and get numeric data", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.setData("raccoon", "solution", 42);
      });

      const value = result.current.getData("raccoon", "solution");
      expect(value).toBe(42);
    });

    it("should set and get function data", () => {
      const { result } = renderHook(() => useDataStore());
      const mockFn = jest.fn(() => 100);

      act(() => {
        result.current.setData("raccoon", "solution", mockFn);
      });

      const value = result.current.getData("raccoon", "solution");
      expect(value).toBe(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("addHandle and removeHandle", () => {
    beforeEach(() => {
      const { result } = renderHook(() => useDataStore());
      act(() => {
        result.current.reset("calculator");
      });
    });

    it("should add new handle", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.addHandle("raccoon", "newHandle");
      });

      const gameObject1Data = result.current.gameObjects.get("raccoon");
      expect(gameObject1Data!.has("newHandle")).toBe(true);

      const newHandle = gameObject1Data!.get("newHandle");
      expect(newHandle).toBeInstanceOf(HandleData);
      expect(newHandle!.access).toBe("all");
      expect(newHandle!.getValue()).toBe(0);
    });

    it("should not add duplicate handle", () => {
      const { result } = renderHook(() => useDataStore());
      const initialSize = result.current.gameObjects.get("raccoon")!.size;

      act(() => {
        result.current.addHandle("raccoon", "solution"); // existing handle
      });

      const finalSize = result.current.gameObjects.get("raccoon")!.size;
      expect(finalSize).toBe(initialSize);
    });

    it("should remove handle", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.addHandle("raccoon", "newHandle");
      });

      act(() => {
        result.current.removeHandle("raccoon", "newHandle");
      });

      const gameObject1Data = result.current.gameObjects.get("raccoon");
      expect(gameObject1Data!.has("newHandle")).toBe(false);
      expect(gameObject1Data!.size).toBe(1); // should have only solution left
    });
  });

  describe("save and init", () => {
    beforeEach(() => {
      localStorageMock.setItem("level", "calculator");
    });

    it("should save store state to localStorage", () => {
      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.reset(localStorageMock.getItem("level")! as LevelId);
        result.current.setData("raccoon", "solution", 42);
      });

      act(() => {
        result.current.save();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "data-store-calculator",
        expect.stringContaining("raccoon")
      );

      // Verify the saved data structure
      const savedData = JSON.parse(
        localStorageMock.getItem("data-store-calculator")!
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

      localStorageMock.setItem(
        "data-store-calculator",
        JSON.stringify(savedData)
      );

      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.init("calculator");
      });

      expect(result.current.initData).toBe(false);
      expect(result.current.gameObjects.size).toBe(
        LEVELS.calculator.modifiableGameObjects.length
      );
      expect(result.current.gameObjects.has("raccoon")).toBe(true);
      expect(
        result.current.gameObjects.get("raccoon")!.get("solution")?.access
      ).toEqual("export");
      expect(result.current.getData("raccoon", "solution")).toBe(42);
    });

    it("should reset when no saved data exists", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useDataStore());
      const resetSpy = jest.spyOn(result.current, "reset");

      act(() => {
        result.current.init("calculator");
      });

      expect(resetSpy).toHaveBeenCalledWith("calculator");
    });
  });
});

describe("createLevelDataHelpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    useDataStore.setState({
      initData: true,
      gameObjects: new Map(),
    });
  });

  it("should create type-safe helpers for a specific level", () => {
    // Initialize store with level data
    const { result } = renderHook(() => useDataStore());
    act(() => {
      result.current.reset("calculator");
    });

    const helpers = createLevelDataHelpers("calculator");

    expect(helpers.initData).toBe(true);
    expect(typeof helpers.setData).toBe("function");
    expect(typeof helpers.getData).toBe("function");
    expect(typeof helpers.addHandle).toBe("function");
    expect(typeof helpers.removeHandle).toBe("function");
  });

  it("should provide working setData and getData methods", () => {
    const { result } = renderHook(() => useDataStore());
    act(() => {
      result.current.reset("calculator");
    });

    const helpers = createLevelDataHelpers("calculator");

    // These calls should be type-safe based on the level configuration
    helpers.setData("raccoon", "solution", 42);
    const value = helpers.getData("raccoon", "solution");

    expect(value).toBe(42);
  });
});

describe("integration tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    localStorageMock.setItem("level", "calculator");
    useDataStore.setState({
      initData: true,
      gameObjects: new Map(),
    });
  });

  it("should handle complete workflow: reset -> modify -> save -> init", () => {
    const { result } = renderHook(() => useDataStore());

    // Reset with level data
    act(() => {
      result.current.reset("calculator");
    });

    // Modify data
    act(() => {
      result.current.setData("raccoon", "solution", 42);
      result.current.addHandle("raccoon", "customHandle");
      result.current.setData("raccoon", "customHandle", 100);
    });

    // Save
    act(() => {
      result.current.save();
    });

    // Clear store
    act(() => {
      useDataStore.setState({
        initData: true,
        gameObjects: new Map(),
      });
    });

    // Initialize from saved data
    act(() => {
      result.current.init("calculator");
    });

    // Verify data persistence (note: values are reset to 0 in init due to HandleData constructor)
    expect(result.current.gameObjects.get("raccoon")!.has("customHandle")).toBe(
      true
    );
    expect(result.current.getData("raccoon", "customHandle")).toBe(100);
    expect(result.current.gameObjects.get("raccoon")!.has("solution")).toBe(
      true
    );
    expect(result.current.getData("raccoon", "solution")).toBe(42);
  });
});
