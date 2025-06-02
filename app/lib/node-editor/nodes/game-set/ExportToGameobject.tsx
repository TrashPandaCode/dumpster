import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useMemo, useRef } from "react";

import type { GameObject } from "~/lib/game/constants";
import { LEVELS } from "~/lib/game/core/levels";
import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { useGameobjectSelect } from "../../hooks/useGameobjectSelect";
import AddHandle from "../../node-components/AddHandle";
import BaseHandle from "../../node-components/BaseHandle";
import LabelHandle from "../../node-components/LabelHandle";
import MultiSelectDropDown from "../../node-components/MultiSelectDropDown";
import NodeContent from "../../node-components/NodeContent";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { getHandleIntersection, getInput } from "../../utils";
import { IN_HANDLE_1 } from "../constants";

const ExportToGameobject = memo(
  ({ id, data, selected }: { id: string; data: any; selected: boolean }) => {
    const level = useGameStore((state) => state.currentLevel);
    const modifiableGameObjects = LEVELS[level].modifiableGameObjects;

    const gameObjects = useDataStore((state) => state.gameObjects);
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

    const setData = useDataStore((state) => state.setData);
    const addHandle = useDataStore((state) => state.addHandle);
    const removeHandle = useDataStore((state) => state.removeHandle);
    const curLabel = useRef(data.curLabel ? data.curLabel.current : "");

    const { updateNodeData } = useReactFlow();

    useEffect(() => {
      updateNodeData(id, {
        compute: (inputs: nodeInputs, _: nodeData) => {
          const index =
            selectedGameObjects.length === 1
              ? 0
              : Math.round(getInput(inputs, IN_HANDLE_1, -1));

          if (0 > index || index >= selectedGameObjects.length) return;

          const gob = selectedGameObjects[index];
          handleIntersection.forEach((handle) => {
            setData(gob, handle, getInput(inputs, handle, 0));
          });
        },
        selectedGameObjects,
      });
    }, [selectedGameObjects]);

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
          {!!selectedGameObjects.length && (
            <AddHandle
              addHandle={(id, label) => addHandle(id as GameObject, label)}
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

export default ExportToGameobject;
