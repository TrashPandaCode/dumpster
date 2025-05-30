import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useMemo } from "react";

import { useDataStore } from "~/lib/zustand/data";
import { useGameobjectSelect } from "../../hooks/useGameobjectSelect";
import BaseHandle from "../../node-components/BaseHandle";
import LabelHandle from "../../node-components/LabelHandle";
import MultiSelectDropDown from "../../node-components/MultiSelectDropDown";
import NodeContent from "../../node-components/NodeContent";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { getHandleIntersection, getInput } from "../../utils";
import { IN_HANDLE_1 } from "../constants";
import type { GameObject } from "~/lib/game/constants";

const ImportFromGameobject = memo(({ id, data }: { id: string; data: any }) => {
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
    () => getHandleIntersection("get", gameObjects, selectedGameObjects),
    [gameObjects, selectedGameObjects]
  );

  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    updateNodeData(id, {
      compute: (inputs: nodeInputs, results: nodeData) => {
        const index =
          selectedGameObjects.length === 1
            ? 0
            : Math.round(getInput(inputs, IN_HANDLE_1, -1));
        if (0 > index || index >= selectedGameObjects.length) {
          results.clear(); //TODO: what behaviour do we want here?
          return;
        }
        const gob = selectedGameObjects[index];
        handleIntersection.forEach((handle) => {
          results.set(handle, gameObjects.get(gob)!.get(handle)!.value);
        });
      },
      selectedGameObjects,
    });
  }, [selectedGameObjects]);

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
});

export default ImportFromGameobject;
