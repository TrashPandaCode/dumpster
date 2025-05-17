import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { memo, useEffect, useRef } from "react";

import { LEVELS } from "~/lib/game/core/levels";
import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import AddHandle from "../../node-components/AddHandle";
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
                  {!modifiableGameObjects
                    .find((g) => g.id === gameObject.current)
                    ?.connections.find(
                      (connection) => connection.label === label
                    ) && (
                    <CrossCircledIcon
                      className="mt-[1px] ml-2 cursor-pointer text-red-400"
                      onClick={() => {
                        removeHandle(gameObject.current, label);
                      }}
                    />
                  )}
                </div>
              )
          )}
          <AddHandle
            addHandle={addHandle}
            handleIdentifier={gameObject.current}
            handleLabel={curLabel}
            nodeId={id}
            updateNodeData={updateNodeData}
          />
        </NodeContent>
      </div>
    );
  }
);

export default ExportToGameobject;
