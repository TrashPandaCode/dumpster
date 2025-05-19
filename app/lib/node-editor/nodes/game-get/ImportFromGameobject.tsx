import { Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { memo, useEffect, useRef } from "react";

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

  return (
    <div className="min-w-48">
      <NodeContent label="Import From Gameobject" type="import">
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
