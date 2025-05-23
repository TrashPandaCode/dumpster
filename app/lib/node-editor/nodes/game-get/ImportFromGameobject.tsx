import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import classnames from "classnames";
import {
  useSelect,
  type UseSelectState,
  type UseSelectStateChangeOptions,
} from "downshift";
import { memo, useEffect, useMemo, useState } from "react";

import { type ConnectionAccess } from "~/lib/game/core/levels";
import { useDataStore, type GameObjectsData } from "~/lib/zustand/data";
import BaseHandle from "../../node-components/BaseHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { getInput } from "../../utils";
import { IN_HANDLE_1 } from "../constants";

type GameObject = string;

const ImportFromGameobject = memo(({ id }: { id: string }) => {
  const gameObjects = useDataStore((state) => state.gameObjects);
  const selectableGameObjects: GameObject[] = Array.from(gameObjects.keys());

  const [selectedGameObjects, setSelectedGameObjects] = useState<GameObject[]>([
    selectableGameObjects[0],
  ]);

  const handleIntersection = useMemo(
    () => getHandleIntersection("get", gameObjects, selectedGameObjects),
    [gameObjects, selectedGameObjects]
  );

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
        handleIntersection.forEach((handle) => {
          results.set(handle, gameObjects.get(gob)!.get(handle)!.value);
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
              "nodrag nowheel absolute z-50 w-60 overflow-hidden rounded-md border border-slate-700 bg-slate-900 p-1 shadow-md",
              !isOpen && "hidden"
            )}
            {...getMenuProps()}
          >
            {isOpen &&
              selectableGameObjects.map((item, index) => (
                <li
                  key={item}
                  {...getItemProps({
                    item,
                    index,
                    "aria-selected": selectedGameObjects.includes(item),
                  })}
                >
                  <div
                    className={classnames(
                      "text-md relative flex h-[25px] cursor-pointer items-center justify-between rounded px-1 font-mono leading-none text-white select-none",
                      index === highlightedIndex && "bg-slate-800"
                    )}
                  >
                    <span>{item}</span>
                    {selectedGameObjects.includes(item) && <CheckIcon />}
                  </div>
                </li>
              ))}
          </ul>
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

function getHandleIntersection(
  handleAccess: ConnectionAccess,
  gameObjects: GameObjectsData,
  selectedGameObjects: GameObject[]
): string[] {
  if (selectedGameObjects.length === 0) return [];

  const getFilteredHandles = (gameObjectLabel: string): Set<string> => {
    const gameObject = gameObjects.get(gameObjectLabel)!;

    const handles = new Set<string>();
    for (const [handle, data] of gameObject) {
      if (data.access === handleAccess || data.access === "all") {
        handles.add(handle);
      }
    }
    return handles;
  };

  // Get the first game object's handles as the starting set
  const intersection = getFilteredHandles(selectedGameObjects[0]);

  // Intersect with each subsequent game object's handles
  for (let i = 1; i < selectedGameObjects.length; i++) {
    const currentHandles = getFilteredHandles(selectedGameObjects[i]);
    // Keep only handles that exist in both sets
    for (const handle of intersection) {
      if (!currentHandles.has(handle)) {
        intersection.delete(handle);
      }
    }
    // Early exit if intersection becomes empty
    if (intersection.size === 0) break;
  }
  return Array.from(intersection);
}
