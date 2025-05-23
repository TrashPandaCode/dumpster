import { Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { useSelect } from "downshift";
import { memo, useEffect, useMemo, useRef, useState } from "react";

import { useDataStore } from "~/lib/zustand/data";
import AddHandle from "../../node-components/AddHandle";
import BaseHandle from "../../node-components/BaseHandle";
import LabelHandle from "../../node-components/LabelHandle";
import MultiSelectDropDown from "../../node-components/MultiSelectDropDown";
import NodeContent from "../../node-components/NodeContent";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import {
  getHandleIntersection,
  getInput,
  stateReducer,
  type GameObject,
} from "../../utils";
import { IN_HANDLE_1 } from "../constants";

const ExportToGameobject = memo(
  ({ id, data, selected }: { id: string; data: any; selected: boolean }) => {
    const gameObjects = useDataStore((state) => state.gameObjects);
    const selectableGameObjects: GameObject[] = Array.from(gameObjects.keys());

    const [selectedGameObjects, setSelectedGameObjects] = useState<
      GameObject[]
    >([selectableGameObjects[0]]);

    const handleIntersection = useMemo(
      () => getHandleIntersection("set", gameObjects, selectedGameObjects),
      [gameObjects, selectedGameObjects]
    );

    const setData = useDataStore((state) => state.setData);
    const addHandle = useDataStore((state) => state.addHandle);
    const removeHandle = useDataStore((state) => state.removeHandle);
    const curLabel = useRef(data.curLabel ? data.curLabel.current : "");

    const { updateNodeData, setEdges } = useReactFlow();
    const updateNodeInternals = useUpdateNodeInternals();

    useEffect(() => {
      updateNodeData(id, {
        compute: (inputs: nodeInputs, _: nodeData) => {
          const index =
            selectedGameObjects.length === 1
              ? 0
              : getInput(inputs, IN_HANDLE_1, -1);

          if (0 > index || index >= selectedGameObjects.length) return;

          const gob = selectedGameObjects[index];
          handleIntersection.forEach((handle) => {
            setData(gob, handle, getInput(inputs, handle, 0));
          });
        },
        selectedGameObjects,
      });
    }, [selectedGameObjects]);

    const {
      isOpen,
      getToggleButtonProps,
      getMenuProps,
      getLabelProps,
      highlightedIndex,
      getItemProps,
    } = useSelect({
      items: selectableGameObjects,
      stateReducer,
      selectedItem: null,
      onSelectedItemChange: ({ selectedItem }) => {
        if (!selectedItem) return;

        const index = selectedGameObjects.indexOf(selectedItem);
        let newSelection = [];

        if (index > 0) {
          newSelection = [
            ...selectedGameObjects.slice(0, index),
            ...selectedGameObjects.slice(index + 1),
          ];
        } else if (index === 0) {
          newSelection = [...selectedGameObjects.slice(1)];
        } else {
          newSelection = [...selectedGameObjects, selectedItem];
        }
        setSelectedGameObjects(newSelection);
        updateNodeInternals(id);
        setEdges((edgs) =>
          edgs.filter(
            (edg) => !(edg.source === id || edg.target === id) || edg.animated
          )
        );
      },
    });

    return (
      <div>
        <NodeContent label="Export To Gameobject" type="export">
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
              position={Position.Left}
              label={label}
            />
          ))}
        </NodeContent>
      </div>
    );
  }
);

export default ExportToGameobject;
