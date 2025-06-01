import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import classnames from "classnames";
import type { UseSelectPropGetters } from "downshift";

const MultiSelectDropDown = ({
  selectedObjects,
  selectableObjects,
  isOpen,
  highlightedIndex,
  useSelectProps,
}: {
  selectedObjects: string[];
  selectableObjects: string[];
  isOpen: boolean;
  highlightedIndex: number;
  useSelectProps: UseSelectPropGetters<string>;
}) => {
  const buttonText =
    selectedObjects.length === 1
      ? selectedObjects[0]
      : selectedObjects.length > 1
        ? `${selectedObjects.length} selected`
        : "select";
  return (
    <>
      <div
        className="nodrag text-md mx-3 flex flex-1 items-baseline rounded-sm border border-slate-700 bg-slate-900 px-1 focus:border-slate-500 focus:outline-none"
        {...useSelectProps.getToggleButtonProps()}
      >
        <span>{buttonText}</span>
        <ChevronDownIcon className="ml-auto text-white" />
      </div>
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
