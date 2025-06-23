import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Position } from "@xyflow/react";
import { memo, useMemo, useState } from "react";

import type { ModifiableGameObject } from "~/lib/game/core/levels";
import { type GameObject } from "~/lib/game/game-objects";
import { useGameobjectSelect } from "~/lib/node-editor/hooks/useGameobjectSelect";
import AddHandle from "~/lib/node-editor/node-components/AddHandle";
import BaseHandle from "~/lib/node-editor/node-components/BaseHandle";
import LabelHandle from "~/lib/node-editor/node-components/LabelHandle";
import MultiSelectDropDown from "~/lib/node-editor/node-components/MultiSelectDropDown";
import NodeContent from "~/lib/node-editor/node-components/NodeContent";
import { IN_HANDLE_1 } from "~/lib/node-editor/nodes/constants";
import { getHandleIntersection } from "~/lib/node-editor/utils/handles";
import { HandleData, type GameObjectsData } from "~/lib/zustand/data";

const DocsExportToGameobject = memo(
  ({ id, data, selected }: { id: string; data: any; selected: boolean }) => {
    const modifiableGameObjects = [
      {
        id: "raccoon",
        connections: [
          { label: "x", access: "all" },
          { label: "y", access: "all" },
        ],
      },
      {
        id: "trashcanFilled",
        connections: [
          { label: "x", access: "export" },
          { label: "y", access: "export" },
        ],
      },
    ] satisfies ModifiableGameObject[];

    const [gameObjects, setGameObjects] = useState<GameObjectsData>(
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
    const selectableGameObjects: GameObject[] = Array.from(gameObjects.keys());

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
      () => getHandleIntersection("export", gameObjects, selectedGameObjects),
      [gameObjects, selectedGameObjects]
    );

    const addHandle = (handleIdentifier: string, label: string) => {
      const id = handleIdentifier as GameObject;

      if (gameObjects.get(id)!.has(label)) return;

      const newGameObjectsMap = new Map(gameObjects);
      newGameObjectsMap.get(id)!.set(label, new HandleData("all", 0));
      setGameObjects(newGameObjectsMap);
    };
    const removeHandle = (id: GameObject, label: string) => {
      const newGameObjectsMap = new Map(gameObjects);
      newGameObjectsMap.get(id)!.delete(label);
      setGameObjects(newGameObjectsMap);
    };

    return (
      <div>
        <NodeContent
          label="Export To Gameobject"
          type="export"
          docsName="export"
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
            <div
              className={
                "flex w-full items-center [&>*:nth-child(even)]:pointer-events-none [&>*:nth-child(even)]:opacity-0 hover:[&>*:nth-child(even)]:pointer-events-auto hover:[&>*:nth-child(even)]:opacity-100 " +
                (selected ? "hover:bg-slate-800" : "hover:bg-slate-700")
              }
              key={label}
            >
              <LabelHandle
                key={label}
                id={label}
                position={Position.Left}
                label={label}
              />
              {!modifiableGameObjects.some(
                ({ id, connections }) =>
                  selectedGameObjects.includes(id) &&
                  connections.some((connection) => connection.label === label)
              ) && (
                <CrossCircledIcon
                  className="mt-[1px] ml-2 cursor-pointer text-red-400"
                  onClick={() => {
                    selectedGameObjects.forEach((gameObject) =>
                      removeHandle(gameObject, label)
                    );
                  }}
                />
              )}
            </div>
          ))}
          {selectedGameObjects.length && (
            <AddHandle
              handleIdentifiers={selectedGameObjects}
              nodeId={id}
              initialLabel={data.handleLabel ?? ""}
              addHandle={(id, label) => addHandle(id as GameObject, label)}
            />
          )}
        </NodeContent>
      </div>
    );
  }
);

export default DocsExportToGameobject;
