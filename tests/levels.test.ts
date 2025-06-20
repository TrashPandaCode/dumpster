import { describe, expect, test } from "bun:test";

import { LEVELS, type Level, type LevelId } from "~/lib/game/core/levels";

describe("LEVELS Object Validation", () => {
  const levelEntries = Object.entries(LEVELS);
  const levelValues = Object.values(LEVELS);

  describe("Basic Structure Validation", () => {
    test("LEVELS object should not be empty", () => {
      expect(levelEntries.length).toBeGreaterThan(0);
    });

    test("all levels should be defined", () => {
      levelValues.forEach((level) => {
        expect(level).toBeDefined();
        expect(level).not.toBeNull();
      });
    });
  });

  describe("Slug and Key Consistency", () => {
    test("slug should match the object key for each level", () => {
      levelEntries.forEach(([key, level]) => {
        expect(level.slug).toBe(key as LevelId);
      });
    });

    test("all slugs should be unique", () => {
      const slugs = levelValues.map((level) => level.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    test("slugs should be valid URL segments (no spaces, special chars)", () => {
      levelValues.forEach((level) => {
        expect(level.slug).toMatch(/^[a-zA-Z0-9_-]+$/);
        expect(level.slug).not.toContain(" ");
      });
    });
  });

  describe("Required Properties Validation", () => {
    const requiredProperties: (keyof Level)[] = [
      "slug",
      "name",
      "description",
      "dialog",
      "goals",
      "success",
      "category",
      "image",
      "initialNodes",
      "initialState",
      "hints",
      "modifiableGameObjects",
      "availableNodes",
      "difficulty",
    ];

    test.each(requiredProperties)(
      "all levels should have required property: %s",
      (property) => {
        levelValues.forEach((level) => {
          expect(level).toHaveProperty(property);
          expect(level[property]).toBeDefined();
        });
      }
    );
  });

  describe("String Properties Validation", () => {
    test("name should be non-empty string", () => {
      levelValues.forEach((level) => {
        expect(typeof level.name).toBe("string");
        expect(level.name.trim()).not.toBe("");
      });
    });

    test("description should be non-empty string", () => {
      levelValues.forEach((level) => {
        expect(typeof level.description).toBe("string");
        expect(level.description.trim()).not.toBe("");
      });
    });

    test("success message should be non-empty string", () => {
      levelValues.forEach((level) => {
        expect(typeof level.success).toBe("string");
        expect(level.success.trim()).not.toBe("");
      });
    });

    test("category should be non-empty string", () => {
      levelValues.forEach((level) => {
        expect(typeof level.category).toBe("string");
        expect(level.category.trim()).not.toBe("");
      });
    });
  });

  describe("Array Properties Validation", () => {
    test("dialog should be non-empty array of strings", () => {
      levelValues.forEach((level) => {
        expect(Array.isArray(level.dialog)).toBe(true);
        expect(level.dialog.length).toBeGreaterThan(0);
        level.dialog.forEach((dialogLine) => {
          expect(typeof dialogLine).toBe("string");
          expect(dialogLine.trim()).not.toBe("");
        });
      });
    });

    test("goals should be non-empty array of strings", () => {
      levelValues.forEach((level) => {
        expect(Array.isArray(level.goals)).toBe(true);
        expect(level.goals.length).toBeGreaterThan(0);
        level.goals.forEach((goal) => {
          expect(typeof goal).toBe("string");
          expect(goal.trim()).not.toBe("");
        });
      });
    });

    test("hints should be array of strings", () => {
      levelValues.forEach((level) => {
        expect(Array.isArray(level.hints)).toBe(true);
        level.hints.forEach((hint) => {
          expect(typeof hint).toBe("string");
        });
      });
    });

    test("initialNodes should be array", () => {
      levelValues.forEach((level) => {
        expect(Array.isArray(level.initialNodes)).toBe(true);
      });
    });

    test("modifiableGameObjects should be non-empty array", () => {
      levelValues.forEach((level) => {
        expect(Array.isArray(level.modifiableGameObjects)).toBe(true);
        expect(level.modifiableGameObjects.length).toBeGreaterThan(0);
      });
    });

    test("availableNodes should be non-empty array", () => {
      levelValues.forEach((level) => {
        expect(Array.isArray(level.availableNodes)).toBe(true);
        expect(level.availableNodes.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Difficulty Validation", () => {
    test("difficulty should be 0, 1, or 2", () => {
      levelValues.forEach((level) => {
        expect([0, 1, 2]).toContain(level.difficulty);
      });
    });
  });

  describe("Function Properties Validation", () => {
    test("initialState should be a function", () => {
      levelValues.forEach((level) => {
        expect(typeof level.initialState).toBe("function");
      });
    });
  });

  describe("ModifiableGameObjects Validation", () => {
    test("each modifiableGameObject should have id and connections", () => {
      levelValues.forEach((level) => {
        level.modifiableGameObjects.forEach((gameObject) => {
          expect(gameObject).toHaveProperty("id");
          expect(gameObject).toHaveProperty("connections");
          expect(typeof gameObject.id).toBe("string");
          expect(Array.isArray(gameObject.connections)).toBe(true);
        });
      });
    });

    test("each connection should have label and access properties", () => {
      levelValues.forEach((level) => {
        level.modifiableGameObjects.forEach((gameObject) => {
          gameObject.connections.forEach((connection) => {
            expect(connection).toHaveProperty("label");
            expect(connection).toHaveProperty("access");
            expect(typeof connection.label).toBe("string");
            expect(connection.label.trim()).not.toBe("");
            expect(["export", "import", "all"]).toContain(connection.access);
          });
        });
      });
    });

    test("gameObject ids should be unique within each level", () => {
      levelValues.forEach((level) => {
        const gameObjectIds = level.modifiableGameObjects.map((obj) => obj.id);
        const uniqueIds = new Set(gameObjectIds);
        expect(uniqueIds.size).toBe(gameObjectIds.length);
      });
    });
  });

  describe("InitialNodes Validation", () => {
    test("each initial node should have required properties", () => {
      levelValues.forEach((level) => {
        level.initialNodes.forEach((node) => {
          expect(node).toHaveProperty("id");
          expect(typeof node.id).toBe("string");

          expect(node).toHaveProperty("type");
          expect(typeof node.type).toBe("string");

          expect(node).toHaveProperty("position");
          expect(node.position).toHaveProperty("x");
          expect(node.position).toHaveProperty("y");
          expect(typeof node.position.x).toBe("number");
          expect(typeof node.position.y).toBe("number");
        });
      });
    });

    test("initial node ids should be unique within each level", () => {
      levelValues.forEach((level) => {
        if (level.initialNodes.length > 0) {
          const nodeIds = level.initialNodes.map((node) => node.id);
          const uniqueIds = new Set(nodeIds);
          expect(uniqueIds.size).toBe(nodeIds.length);
        }
      });
    });
  });

  describe("Level Names Uniqueness", () => {
    test("all level names should be unique", () => {
      const names = levelValues.map((level) => level.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe("AvailableNodes Validation", () => {
    test("availableNodes should contain valid node types", () => {
      const expectedNodeTypes = [
        "Display",
        "Value",
        "Math",
        "Switch",
        "KeyPress",
        "ImportFromGameobject",
        "ExportToGameobject",
        "Time",
        "ForLoop",
        "Group",
        "MousePosition",
      ];

      levelValues.forEach((level) => {
        level.availableNodes.forEach((nodeType) => {
          expect(typeof nodeType).toBe("string");
          expect(expectedNodeTypes).toContain(nodeType);
        });
      });
    });

    test("availableNodes should not contain duplicates within each level", () => {
      levelValues.forEach((level) => {
        const uniqueNodes = new Set(level.availableNodes);
        expect(uniqueNodes.size).toBe(level.availableNodes.length);
      });
    });
  });
});
