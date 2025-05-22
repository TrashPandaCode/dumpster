import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import classnames from "classnames";
import {
  useSelect,
  type UseSelectState,
  type UseSelectStateChangeOptions,
} from "downshift";
import { memo, useEffect, useRef, useState } from "react";

import { LEVELS } from "~/lib/game/core/levels";
import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import SelectDropDown from "../../node-components/SelectDropDown";
import type { nodeData, nodeInputs } from "../../node-store/node-store";

const ImportFromGameobject = memo(({ id, data }: { id: string; data: any }) => {
  const level = useGameStore((state) => state.currentLevel);
  const modifiableGameObjects = LEVELS[level].modifiableGameObjects;

  const gameObjects = useDataStore((state) => state.gameObjects);
  const gameObject = useRef(
    data.gameObject ? data.gameObject.current : modifiableGameObjects[0].id
  ); // we assume there is at least one game object editable if this node is enabled

  const { updateNodeData, setEdges } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeData(id, {
      compute: (_: nodeInputs, results: nodeData) => {
        gameObjects.get(gameObject.current)!.forEach(({ handleId, value }) => {
          results.set(handleId, value);
        });
      },
    });
  }, []);

  const handleSelect = (selected: string) => {
    gameObject.current = selected;
    updateNodeData(id, { gameObject });
    updateNodeInternals(id);

    // remove all edges with import node as source
    setEdges((edgs) => edgs.filter((edg) => edg.source !== id));
  };

  const [selectedItems, setSelectedItems] = useState<item[]>(["bean"]);

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: books,
    stateReducer,
    selectedItem: null,
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) return;

      const index = selectedItems.indexOf(selectedItem);

      if (index > 0) {
        setSelectedItems([
          ...selectedItems.slice(0, index),
          ...selectedItems.slice(index + 1),
        ]);
      } else if (index === 0) {
        setSelectedItems([...selectedItems.slice(1)]);
      } else {
        setSelectedItems([...selectedItems, selectedItem]);
      }
    },
  });

  const buttonText =
    selectedItems.length === 1
      ? selectedItems[0]
      : selectedItems.length > 1
        ? `${selectedItems.length} selected`
        : "select";

  return (
    <div className="min-w-48">
      <NodeContent label="Import From Gameobject" type="import">
        <div className="flex w-72 flex-col gap-1">
          <div
            className="nodrag text-md mx-3 flex flex-1 items-baseline rounded-sm border border-slate-700 bg-slate-900 px-1 text-white focus:border-slate-500 focus:outline-none"
            {...getToggleButtonProps()}
          >
            <span>{buttonText}</span>
            <ChevronDownIcon className="ml-auto text-white" />
          </div>
        </div>
        <ul
          className={classnames(
            "nodrag nowheel absolute w-60 bg-slate-900 shadow-md",
            !isOpen && "hidden"
          )}
          {...getMenuProps()}
        >
          {isOpen &&
            books.map((item, index) => (
              <li
                className={classnames(
                  highlightedIndex === index && "bg-blue-300",
                  selectedItems.includes(item) && "font-bold",
                  "flex items-center gap-3 px-3 py-2 shadow-sm"
                )}
                key={item}
                {...getItemProps({
                  item,
                  index,
                  "aria-selected": selectedItems.includes(item),
                })}
              >
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={selectedItems.includes(item)}
                  value={item}
                  onChange={() => null}
                />
                <div className="flex flex-col">
                  <span>{item}</span>
                </div>
              </li>
            ))}
        </ul>
        <SelectDropDown
          items={{ "Game objects": Array.from(gameObjects.keys()) }}
          setSelected={handleSelect}
          defaultValue={gameObject.current}
        />
        {Array.from(gameObjects.get(gameObject.current) ?? []).map(
          ([label, { handleId, access }]) =>
            access !== "set" && (
              <LabelHandle
                key={handleId}
                id={handleId}
                position={Position.Right}
                label={label}
              />
            )
        )}
      </NodeContent>
    </div>
  );
});

export default ImportFromGameobject;

type item = string;

const books: item[] = ["bean", "bean1", "bean2", "bean3", "bean4", "bean5"];

function stateReducer(
  state: UseSelectState<item>,
  actionAndChanges: UseSelectStateChangeOptions<item>
): Partial<UseSelectState<item>> {
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
