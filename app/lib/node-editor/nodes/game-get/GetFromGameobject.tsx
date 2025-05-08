import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import { LEVELS } from "~/lib/game/core/levels";
import { useDebugStore } from "~/lib/zustand/debug";
import { useGameStore } from "~/lib/zustand/game";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import SelectDropDown from "../../node-components/SelectDropDown";
import type { nodeData, nodeInputs } from "../../node-store/node-store";

const GetFromGameobject = memo(({ id }: { id: string }) => {
  const level = useGameStore((state) => state.currentLevel);
  const modifiableGameObjects = LEVELS[level].modifiableGameObjects;

  const gameObjects = useDebugStore((state) => state.gameObjects);
  const [gameObject, setGameObject] = useState(modifiableGameObjects[0].id); // we assume there is at least one game object editable if this node is enabled

  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    updateNodeData(id, {
      compute: (_: nodeInputs, results: nodeData) => {
        gameObjects.get(gameObject)!.forEach(({ handleId, value }) => {
          results.set(handleId, value);
        });
      },
    });
  }, [gameObject]);

  return (
    <div className="min-w-48">
      <NodeContent label="XPOS TEST" type="float">
        <SelectDropDown
          items={{ "Game objects": Array.from(gameObjects.keys()) }}
          setSelected={setGameObject}
          defaultValue={gameObject}
        />
        {Array.from(gameObjects.get(gameObject)!).map(
          ([label, { handleId }]) => (
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

export default GetFromGameobject;
