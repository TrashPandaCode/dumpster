import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Position, useReactFlow } from "@xyflow/react";
import { memo, useMemo, useRef, useState } from "react";

import { type GameObject } from "~/lib/game/constants";
import type { ModifiableGameObject } from "~/lib/game/core/levels";
import { useGameobjectSelect } from "~/lib/node-editor/hooks/useGameobjectSelect";
import AddHandle from "~/lib/node-editor/node-components/AddHandle";
import BaseHandle from "~/lib/node-editor/node-components/BaseHandle";
import LabelHandle from "~/lib/node-editor/node-components/LabelHandle";
import MultiSelectDropDown from "~/lib/node-editor/node-components/MultiSelectDropDown";
import NodeContent from "~/lib/node-editor/node-components/NodeContent";
import { IN_HANDLE_1 } from "~/lib/node-editor/nodes/constants";
import { getHandleIntersection } from "~/lib/node-editor/utils";
import type { GameObjectsData } from "~/lib/zustand/data";

const DocsExportToGameobject = memo(
  ({ id, data, selected }: { id: string; data: any; selected: boolean }) => {
    const modifiableGameObjects = [
      {
        id: "raccoon",
        connections: [
          { label: "xpos", access: "all" },
          { label: "ypos", access: "all" },
        ],
      },
      {
        id: "trashcan",
        connections: [
          { label: "xpos", access: "set" },
          { label: "ypos", access: "set" },
        ],
      },
    ] satisfies ModifiableGameObject[];

    const [gameObjects, setGameObjects] = useState<GameObjectsData>(
      new Map([
        [
          "raccoon",
          new Map([
            ["xpos", { access: "all", value: 145.7 }],
            ["ypos", { access: "all", value: 89.3 }],
            ["rotation", { access: "set", value: 1.57 }],
            ["xvelocity", { access: "get", value: -2.4 }],
            ["yvelocity", { access: "get", value: 0.8 }],
            ["health", { access: "all", value: 85.0 }],
          ]),
        ],
        [
          "trashcan",
          new Map([
            ["xpos", { access: "set", value: 145.7 }],
            ["ypos", { access: "set", value: 89.3 }],
            ["rotation", { access: "set", value: 1.57 }],
            ["xvelocity", { access: "get", value: -2.4 }],
            ["yvelocity", { access: "get", value: 0.8 }],
            ["health", { access: "all", value: 85.0 }],
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
    } = useGameobjectSelect(
      selectableGameObjects,
      data.selectedGameObjects
        ? data.selectedGameObjects
        : [selectableGameObjects[0]],
      id
    );

    const handleIntersection = useMemo(
      () => getHandleIntersection("set", gameObjects, selectedGameObjects),
      [gameObjects, selectedGameObjects]
    );

    const addHandle = (handleIdentifier: string, label: string) => {
      const id = handleIdentifier as GameObject;

      if (gameObjects.get(id)!.has(label)) return;

      const newGameObjectsMap = new Map(gameObjects);
      newGameObjectsMap.get(id)!.set(label, { access: "all", value: 0 });
      setGameObjects(newGameObjectsMap);
    };
    const removeHandle = (id: GameObject, label: string) => {
      const newGameObjectsMap = new Map(gameObjects);
      newGameObjectsMap.get(id)!.delete(label);
      setGameObjects(newGameObjectsMap);
    };
    const curLabel = useRef(data.curLabel ? data.curLabel.current : "");

    const { updateNodeData } = useReactFlow();

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
              addHandle={addHandle}
              handleIdentifiers={selectedGameObjects}
              handleLabel={curLabel}
              nodeId={id}
              updateNodeData={updateNodeData}
            />
          )}
        </NodeContent>
      </div>
    );
  }
);

export default DocsExportToGameobject;
