import { Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import { LEVELS } from "~/lib/game/core/levels";
import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import SelectDropDown from "../../node-components/SelectDropDown";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { getInput } from "../../node-store/utils";

const ExportToGameobject = memo(({ id }: { id: string }) => {
  const level = useGameStore((state) => state.currentLevel);
  const modifiableGameObjects = LEVELS[level].modifiableGameObjects;

  const { updateNodeData } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const [gameObject, setGameObject] = useState(modifiableGameObjects[0].id); // we assume there is at least one game object editable if this node is enabled
  const gameObjects = useDataStore((state) => state.gameObjects);

  const setData = useDataStore((state) => state.setData);
  const addHandle = useDataStore((state) => state.addHandle);
  const [curLabel, setCurLabel] = useState("");

  useEffect(() => {
    updateNodeData(id, {
      compute: (inputs: nodeInputs, _: nodeData) => {
        gameObjects.get(gameObject)!.forEach(({ handleId, access }, label) => {
          if (access === "get") return;
          setData(gameObject, label, getInput(inputs, handleId, 0));
        });
      },
    });
  }, [gameObjects, gameObject]);

  return (
    <div>
      <NodeContent label="Export To Gameobject" type="export">
        <SelectDropDown
          items={{ "Game objects": Array.from(gameObjects.keys()) }}
          setSelected={(selected: string) => {
            setGameObject(selected);
            updateNodeInternals(id);
          }}
          defaultValue={gameObject}
        />
        {Array.from(gameObjects.get(gameObject) ?? []).map(
          ([label, { handleId, access }]) =>
            access === "get" ? (
              <></>
            ) : (
              <LabelHandle
                key={handleId}
                id={handleId}
                position={Position.Left}
                label={label}
              />
            )
        )}
        <div>
          <input
            type="text"
            className="nodrag ml-3 w-12 rounded-sm border-1 border-slate-700 bg-slate-900 px-1 focus:border-slate-500 focus:outline-none disabled:text-slate-500"
            onChange={(evt) => {
              setCurLabel(evt.target.value);
            }}
          />
          <button
            className="ml-2 hover:cursor-pointer"
            onClick={() => {
              addHandle(gameObject, curLabel);
            }}
          >
            +
          </button>
        </div>
      </NodeContent>
    </div>
  );
});

export default ExportToGameobject;
