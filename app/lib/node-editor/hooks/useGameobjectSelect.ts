import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import {
  useSelect,
  type UseSelectState,
  type UseSelectStateChangeOptions,
} from "downshift";
import { useState } from "react";

import type { GameObject } from "~/lib/game/game-objects";

export function useGameobjectSelect(
  items: GameObject[],
  initialSelection: GameObject[],
  id: string
) {
  const { setEdges } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const [selectedGameObjects, setSelectedGameObjects] =
    useState<GameObject[]>(initialSelection);

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getLabelProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items,
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

  const handleReorder = (newOrder: GameObject[]) => {
    setSelectedGameObjects(newOrder);
  };

  return {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getLabelProps,
    highlightedIndex,
    getItemProps,
    selectedGameObjects,
    handleReorder,
  };
}

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
