import { Position } from "@xyflow/react";
import { memo, useMemo, useRef } from "react";

import { type GameObject } from "~/lib/game/gameObjects";
import { useGameobjectSelect } from "~/lib/node-editor/hooks/useGameobjectSelect";
import BaseHandle from "~/lib/node-editor/node-components/BaseHandle";
import LabelHandle from "~/lib/node-editor/node-components/LabelHandle";
import MultiSelectDropDown from "~/lib/node-editor/node-components/MultiSelectDropDown";
import NodeContent from "~/lib/node-editor/node-components/NodeContent";
import { IN_HANDLE_1 } from "~/lib/node-editor/nodes/constants";
import { getHandleIntersection } from "~/lib/node-editor/utils/handles";
import { type GameObjectsData } from "~/lib/zustand/data";

const DocsImportFromGameobject = memo(
  ({ id, data }: { id: string; data: any }) => {
    const gameObjects = useRef<GameObjectsData>(
      new Map([
        [
          "raccoon",
          new Map([
            ["xpos", { access: "all", value: 145.7 }],
            ["ypos", { access: "all", value: 89.3 }],
            ["rotation", { access: "export", value: 1.57 }],
            ["xvelocity", { access: "import", value: -2.4 }],
            ["yvelocity", { access: "import", value: 0.8 }],
            ["health", { access: "all", value: 85.0 }],
          ]),
        ],
        [
          "trashcanFilled",
          new Map([
            ["xpos", { access: "export", value: 145.7 }],
            ["ypos", { access: "export", value: 89.3 }],
            ["rotation", { access: "export", value: 1.57 }],
            ["xvelocity", { access: "import", value: -2.4 }],
            ["yvelocity", { access: "import", value: 0.8 }],
            ["health", { access: "all", value: 85.0 }],
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
