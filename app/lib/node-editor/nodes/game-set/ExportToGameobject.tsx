import { Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import React, { memo, useEffect, useRef } from "react";

import { LEVELS } from "~/lib/game/core/levels";
import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import SelectDropDown from "../../node-components/SelectDropDown";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { getInput } from "../../node-store/utils";

const ExportToGameobject = memo(({ id, data }: { id: string; data: any }) => {
  const level = useGameStore((state) => state.currentLevel);
  const modifiableGameObjects = LEVELS[level].modifiableGameObjects;

  const { updateNodeData } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const gameObject = useRef(
    data.gameObject ? data.gameObject.current : modifiableGameObjects[0].id
  ); // we assume there is at least one game object editable if this node is enabled
  const gameObjects = useDataStore((state) => state.gameObjects);

  const setData = useDataStore((state) => state.setData);
  const addHandle = useDataStore((state) => state.addHandle);
  const curLabel = useRef(data.curLabel ? data.curLabel.current : "");

  useEffect(() => {
    updateNodeData(id, {
      compute: (inputs: nodeInputs, _: nodeData) => {
        gameObjects
          .get(gameObject.current)!
          .forEach(({ handleId, access }, label) => {
            if (access === "get") return;
            setData(gameObject.current, label, getInput(inputs, handleId, 0));
          });
      },
      gameObject,
    });
  }, []);

  return (
    <div>
      <NodeContent label="Export To Gameobject" type="export">
        <SelectDropDown
          items={{ "Game objects": Array.from(gameObjects.keys()) }}
          setSelected={(selected: string) => {
            gameObject.current = selected;
            updateNodeData(id, { gameObject });
            updateNodeInternals(id);
          }}
          defaultValue={gameObject.current}
        />
        {Array.from(gameObjects.get(gameObject.current) ?? []).map(
          ([label, { handleId, access }]) =>
            access === "get" ? (
              <React.Fragment key={handleId}></React.Fragment>
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
            value={curLabel.current}
            className="nodrag ml-3 w-12 rounded-sm border-1 border-slate-700 bg-slate-900 px-1 focus:border-slate-500 focus:outline-none disabled:text-slate-500"
            onChange={(evt) => {
              curLabel.current = evt.target.value;
              updateNodeData(id, { curLabel });
            }}
          />
          <button
            className="ml-2 hover:cursor-pointer"
            onClick={() => {
              addHandle(gameObject.current, curLabel.current);
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
