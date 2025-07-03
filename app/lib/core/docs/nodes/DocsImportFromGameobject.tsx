/*
 * Authors:
 *
 * Purpose:
 */
import { Position } from "@xyflow/react";
import { memo, useMemo, useRef } from "react";

import { type GameObject } from "~/lib/game/game-objects";
import { useGameobjectSelect } from "~/lib/node-editor/hooks/useGameobjectSelect";
import BaseHandle from "~/lib/node-editor/node-components/BaseHandle";
import LabelHandle from "~/lib/node-editor/node-components/LabelHandle";
import MultiSelectDropDown from "~/lib/node-editor/node-components/MultiSelectDropDown";
import NodeContent from "~/lib/node-editor/node-components/NodeContent";
import { IN_HANDLE_1 } from "~/lib/node-editor/nodes/constants";
import { getHandleIntersection } from "~/lib/node-editor/utils/handles";
import { HandleData, type GameObjectsData } from "~/lib/zustand/data";

const DocsImportFromGameobject = memo(
  ({ id, data }: { id: string; data: any }) => {
    const gameObjects = useRef<GameObjectsData>(
      new Map([
        [
          "raccoon",
          new Map([
            ["x", new HandleData("all", 145.7)],
            ["y", new HandleData("all", 89.3)],
            ["rotation", new HandleData("export", 1.57)],
            ["x_velocity", new HandleData("import", -2.4)],
            ["y_velocity", new HandleData("import", 0.8)],
            ["health", new HandleData("all", 85.0)],
          ]),
        ],
        [
          "trashcanFilled",
          new Map([
            ["x", new HandleData("export", 145.7)],
            ["y", new HandleData("export", 89.3)],
            ["rotation", new HandleData("export", 1.57)],
            ["x_velocity", new HandleData("import", -2.4)],
            ["y_velocity", new HandleData("import", 0.8)],
            ["health", new HandleData("all", 85.0)],
          ]),
        ],
      ])
    );
    const selectableGameObjects: GameObject[] = Array.from(
      gameObjects.current.keys()
    );

    const {
      isOpen,
      getToggleButtonProps,
      getMenuProps,
      getLabelProps,
      highlightedIndex,
      getItemProps,
      selectedGameObjects,
      handleReorder,
    } = useGameobjectSelect(
      selectableGameObjects,
      data.selectedGameObjects
        ? data.selectedGameObjects
        : [selectableGameObjects[0]],
      id
    );

    const handleIntersection = useMemo(
      () =>
        getHandleIntersection(
          "import",
          gameObjects.current,
          selectedGameObjects
        ),
      [gameObjects, selectedGameObjects]
    );

    return (
      <div className="min-w-48">
        <NodeContent
          label="Import From Gameobject"
          type="import"
          docsName="import"
        >
          <div className="text-left">
            {selectedGameObjects.length > 1 && (
              <BaseHandle id={IN_HANDLE_1} position={Position.Left} />
            )}
            <MultiSelectDropDown
              highlightedIndex={highlightedIndex}
              isOpen={isOpen}
              selectableObjects={selectableGameObjects}
              selectedObjects={selectedGameObjects}
              onReorder={handleReorder}
              useSelectProps={{
                getItemProps: getItemProps,
                getLabelProps: getLabelProps,
                getMenuProps: getMenuProps,
                getToggleButtonProps: getToggleButtonProps,
              }}
            />
          </div>
          {handleIntersection.map((label) => (
            <LabelHandle
              key={label}
              id={label}
              position={Position.Right}
              label={label}
            />
          ))}
        </NodeContent>
      </div>
    );
  }
);

export default DocsImportFromGameobject;
