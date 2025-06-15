import {
  CheckIcon,
  ChevronDownIcon,
  DragHandleDots2Icon,
} from "@radix-ui/react-icons";
import classnames from "classnames";
import type { UseSelectPropGetters } from "downshift";
import { useRef, useState } from "react";

const MultiSelectDropDown = <T extends string>({
  selectedObjects,
  selectableObjects,
  isOpen,
  highlightedIndex,
  useSelectProps,
  onReorder,
}: {
  selectedObjects: T[];
  selectableObjects: T[];
  isOpen: boolean;
  highlightedIndex: number;
  useSelectProps: UseSelectPropGetters<T>;
  onReorder: (newOrder: T[]) => void;
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const draggedItemRef = useRef<string | null>(null);

  const buttonText =
    selectedObjects.length === 1
      ? selectedObjects[0]
      : selectedObjects.length > 1
        ? `${selectedObjects.length} selected`
        : "select";

  const handleDragStart = (e: React.DragEvent, item: string, index: number) => {
    setDraggedIndex(index);
    draggedItemRef.current = item;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedItemRef.current === null) return;

    const draggedItem = draggedItemRef.current as T;
    const newOrder = [...selectedObjects];

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);

    onReorder(newOrder);

    setDraggedIndex(null);
    setDragOverIndex(null);
    draggedItemRef.current = null;
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    draggedItemRef.current = null;
  };

  return (
    <>
      <div
        className="nodrag text-md mx-3 flex flex-1 items-baseline rounded-sm border border-slate-700 bg-slate-900 px-1 focus:border-slate-500 focus:outline-none"
        {...useSelectProps.getToggleButtonProps()}
      >
        <span>{buttonText}</span>
        <ChevronDownIcon className="ml-auto text-white" />
      </div>

      {selectedObjects.length > 1 && (
        <div className="nodrag mx-3 mt-1 rounded-sm border border-slate-600 bg-slate-800 p-1">
          <div className="mb-1 text-xs text-gray-400">
            Selected (drag to reorder):
          </div>
          {selectedObjects.map((item, index) => (
            <div
              key={`selected-${item}-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, item, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={classnames(
                "mb-1 flex cursor-move items-center justify-between rounded px-2 py-1 font-mono text-sm text-white select-none last:mb-0",
                draggedIndex === index && "opacity-50",
                dragOverIndex === index && "bg-slate-600",
                dragOverIndex !== index && "bg-slate-700 hover:bg-slate-600"
              )}
            >
              <span className="flex items-center gap-1">
                <DragHandleDots2Icon className="text-gray-400" />
                {item}
              </span>
              <span className="text-xs text-gray-400">#{index}</span>
            </div>
          ))}
        </div>
      )}

      <ul
        className={classnames(
          "nodrag nowheel absolute z-50 w-60 overflow-hidden rounded-md border border-slate-700 bg-slate-900 p-1 shadow-md",
          !isOpen && "hidden"
        )}
        {...useSelectProps.getMenuProps()}
      >
        {isOpen &&
          selectableObjects.map((item, index) => (
            <li
              key={item}
              {...useSelectProps.getItemProps({
                item,
                index,
                "aria-selected": selectedObjects.includes(item),
              })}
            >
              <div
                className={classnames(
                  "text-md relative flex h-[25px] cursor-pointer items-center justify-between rounded px-1 font-mono leading-none text-white select-none",
                  index === highlightedIndex && "bg-slate-800"
                )}
              >
                <span>{item}</span>
                {selectedObjects.includes(item) && <CheckIcon />}
              </div>
            </li>
          ))}
      </ul>
    </>
  );
};

export default MultiSelectDropDown;
