import { CrossCircledIcon, PlusIcon } from "@radix-ui/react-icons";
import { Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { memo, useEffect, useRef } from "react";

import { LEVELS } from "~/lib/game/core/levels";
import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import SelectDropDown from "../../node-components/SelectDropDown";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { getInput } from "../../node-store/utils";

const ExportToGameobject = memo(
  ({ id, data, selected }: { id: string; data: any; selected: boolean }) => {
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
    const removeHandle = useDataStore((state) => state.removeHandle);
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
              access !== "get" && (
                <div
                  className={
                    "flex w-full items-center [&>*:nth-child(even)]:pointer-events-none [&>*:nth-child(even)]:opacity-0 hover:[&>*:nth-child(even)]:pointer-events-auto hover:[&>*:nth-child(even)]:opacity-100 " +
                    (selected ? "hover:bg-slate-800" : "hover:bg-slate-700")
                  }
                  key={handleId}
                >
                  <LabelHandle
                    id={handleId}
                    position={Position.Left}
                    label={label}
                  />
                  <CrossCircledIcon
                    className="cursor-pointer text-red-400 ml-2 mt-[1px]"
                    onClick={() => {
                      removeHandle(gameObject.current, label);
                    }}
                  />
                </div>
              )
          )}
          <div className="relative mt-3 px-3">
            <input
              type="text"
              value={curLabel.current}
              className="nodrag peer w-full rounded-sm border-1 border-slate-700 bg-slate-900 px-1 focus:border-slate-500 focus:outline-none disabled:text-slate-500"
              placeholder="Handle Name"
              onChange={(evt) => {
                curLabel.current = evt.target.value;
                updateNodeData(id, { curLabel });
              }}
              onKeyDown={(evt) => {
                if (evt.key === "Enter") {
                  addHandle(gameObject.current, curLabel.current);
                  curLabel.current = "";
                }
              }}
            />
            <PlusIcon
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-400 opacity-0 transition-opacity duration-100 peer-focus:opacity-100"
              onClick={() => {
                addHandle(gameObject.current, curLabel.current);
                curLabel.current = "";
              }}
            />
          </div>
        </NodeContent>
      </div>
    );
  }
);

export default ExportToGameobject;
