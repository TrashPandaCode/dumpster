import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import classnames from "classnames";
import {
  useSelect,
  type UseSelectState,
  type UseSelectStateChangeOptions,
} from "downshift";
import { memo, useEffect, useRef, useState } from "react";

import { LEVELS, type ConnectionAccess } from "~/lib/game/core/levels";
import { useDataStore, type GameObjectsData } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import BaseHandle from "../../node-components/BaseHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import SelectDropDown from "../../node-components/SelectDropDown";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { getInput } from "../../utils";
import { IN_HANDLE_1 } from "../constants";

type GameObject = string;

const ImportFromGameobject = memo(({ id, data }: { id: string; data: any }) => {
  const gameObjects = useDataStore((state) => state.gameObjects);
  const selectableGameObjects: GameObject[] = Array.from(gameObjects.keys());

  const [selectedGameObjects, setSelectedGameObjects] = useState<GameObject[]>([
    selectableGameObjects[0],
  ]);
  const handleIntersection = useRef(
    getHandleIntersection(gameObjects, selectedGameObjects)
  );

  console.log(handleIntersection);

  const { updateNodeData, setEdges } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeData(id, {
      compute: (inputs: nodeInputs, results: nodeData) => {
        const index =
          selectedGameObjects.length === 1
            ? 0
            : getInput(inputs, IN_HANDLE_1, -1);

        if (0 > index || index >= selectedGameObjects.length) {
          results.clear();
          return;
        }

        const gob = selectedGameObjects[index];
        handleIntersection.current.forEach((handleName) => {
          results.set(handleName, gameObjects.get(gob)!.get(handleName)!.value);
        });
      },
    });
  }, [selectedGameObjects]);

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
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

      handleIntersection.current = getHandleIntersection(
        gameObjects,
        newSelection
      );
      console.log(handleIntersection.current);

      setSelectedGameObjects(newSelection);
      updateNodeInternals(id);
      setEdges((edgs) =>
        edgs.filter((edg) => !(edg.source === id || edg.target === id))
      );
    },
  });

  const buttonText =
    selectedGameObjects.length === 1
      ? selectedGameObjects[0]
      : selectedGameObjects.length > 1
        ? `${selectedGameObjects.length} selected`
        : "select";

  return (
    <div className="min-w-48">
      <NodeContent label="Import From Gameobject" type="import">
        <div className="text-left">
          {selectedGameObjects.length > 1 && (
            <BaseHandle id={IN_HANDLE_1} position={Position.Left} />
          )}
          <div
            className="nodrag text-md mx-3 flex flex-1 items-baseline rounded-sm border border-slate-700 bg-slate-900 px-1 focus:border-slate-500 focus:outline-none"
            {...getToggleButtonProps()}
          >
            <span>{buttonText}</span>
            <ChevronDownIcon className="ml-auto text-white" />
          </div>
          <ul
            className={classnames(
              "nodrag nowheel absolute z-50 w-60 bg-slate-900 shadow-md",
              !isOpen && "hidden"
            )}
            {...getMenuProps()}
          >
            {isOpen &&
              selectableGameObjects.map((item, index) => (
                <li
                  className={classnames(
                    highlightedIndex === index && "bg-blue-300",
                    selectedGameObjects.includes(item) && "font-bold",
                    "flex items-center gap-3 px-3 py-2 shadow-sm"
                  )}
                  key={item}
                  {...getItemProps({
                    item,
                    index,
                    "aria-selected": selectedGameObjects.includes(item),
                  })}
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={selectedGameObjects.includes(item)}
                    value={item}
                    onChange={() => null}
                  />
                  <div className="flex flex-col">
                    <span>{item}</span>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        {handleIntersection.current.map((label) => (
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

function stateReducer(
  state: UseSelectState<GameObject>,
  actionAndChanges: UseSelectStateChangeOptions<GameObject>
): Partial<UseSelectState<GameObject>> {
  const { changes, type } = actionAndChanges;
  switch (type) {
    case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
    case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
    case useSelect.stateChangeTypes.ItemClick:
      return {
        ...changes,
        isOpen: true,
        highlightedIndex: state.highlightedIndex,
      };
    default:
      return changes;
  }
}

// currently also handles of wrong access type are evaluated

function getHandleIntersection(
  gameObjectsData: GameObjectsData,
  gameObjectLabels: string[]
): string[] {
  if (gameObjectLabels.length === 0) {
    return [];
  }
  // Get the first game object's handles as the starting set
  const firstGameObject = gameObjectsData.get(gameObjectLabels[0]);
  if (!firstGameObject) {
    return []; // If first object doesn't exist, no intersection possible
  }
  let intersection = new Set(firstGameObject.keys());
  // Intersect with each subsequent game object's handles
  for (let i = 1; i < gameObjectLabels.length; i++) {
    const currentGameObject = gameObjectsData.get(gameObjectLabels[i]);
    if (!currentGameObject) {
      return []; // If any object doesn't exist, no intersection possible
    }
    const currentHandles = new Set(currentGameObject.keys());
    // Keep only handles that exist in both sets
    intersection = new Set(
      [...intersection].filter((handle) => currentHandles.has(handle))
    );
    // Early exit if intersection becomes empty
    if (intersection.size === 0) {
      break;
    }
  }
  return Array.from(intersection);
}
