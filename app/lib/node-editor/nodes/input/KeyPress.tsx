/*
 * Authors: Jonathan Kron
 *
 * Purpose:
 * React component representing an input node that detects keyboard key events.
 */
import { Position, useReactFlow } from "@xyflow/react";
import classnames from "classnames";
import { memo, useEffect, useState } from "react";

import { globalKeyTracker } from "~/lib/game/utils/global-keytracker";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import SelectDropDown from "../../node-components/SelectDropDown";
import type { nodeInputs, nodeResults } from "../../node-store/node-store";
import { OUT_HANDLE_1 } from "../constants";

/**
 * - `down` - Key is currently being held down
 * - `press` - Key was first pressed, true for only one frame
 * - `release` - Key was released, true for only one frame
 */
type KeyState = "down" | "press" | "release";

/**
 * React component representing an input node that detects keyboard key events.
 *
 * - Detects whether a specific key is currently:
 *   - Held down ("down")
 *   - Just pressed ("press")
 *   - Just released ("release")
 * - The selected key and key state are configurable through the UI.
 *
 * Props:
 * @param {string} id - Unique identifier for the node.
 * @param {any} data - Data passed to initialize state (e.g. key, press type).
 *
 * Zustand:
 * - Uses `useKeyStore` to access real-time keyboard state via:
 *   - `isKeyDown`
 *   - `isKeyPressed`
 *   - `isKeyReleased`
 *
 * React Flow:
 * - Registers a `compute` function via `updateNodeData` on mount or when the press type changes.
 * - Outputs `1` (true) or `0` (false) based on the selected key's state.
 *
 * Output Handles:
 * - `OUT_HANDLE_1` — Output value indicating if the specified key condition is met.
 *
 * UI:
 * - Includes three toggle buttons for key state and a dropdown to select the key to monitor.
 * - Displays visual feedback (e.g. active highlighting) when the key condition is true.
 */
const KeyPress = memo(({ id, data }: { id: string; data: any }) => {
  const { updateNodeData } = useReactFlow();
  const [curKey, setCurKey] = useState<string>(data.curKey ?? "");
  const [keyPressType, setKeyPressType] = useState<KeyState>(
    data.keyPressType ?? "down"
  );

  const [active, setActive] = useState(false);

  useEffect(() => {
    updateNodeData(id, {
      compute: (_: nodeInputs, results: nodeResults) => {
        let active = false;
        switch (keyPressType) {
          case "down":
            active = globalKeyTracker.isKeyDown(curKey);
            results.set(OUT_HANDLE_1, +active);
            break;
          case "press":
            active = globalKeyTracker.isKeyPressed(curKey);
            results.set(OUT_HANDLE_1, +active);
            break;
          case "release":
            active = globalKeyTracker.isKeyReleased(curKey);
            results.set(OUT_HANDLE_1, +active);
            break;
        }
        setActive(active);
      },
      curKey,
      keyPressType,
    });
  }, [keyPressType, curKey]);

  return (
    <div className="min-w-60">
      <NodeContent
        label="KeyPress"
        type="input"
        active={active}
        docsName="keypress"
      >
        <div className="mb-2 flex w-full flex-row">
          <button
            className={classnames(
              "nodrag m-auto rounded px-2 hover:cursor-pointer",
              keyPressType == "down"
                ? "outline outline-blue-300"
                : "bg-slate-900"
            )}
            onClick={() => {
              setKeyPressType("down");
            }}
          >
            Down
          </button>
          <button
            className={classnames(
              "nodrag m-auto rounded px-2 hover:cursor-pointer",
              keyPressType == "press"
                ? "outline outline-blue-300"
                : "bg-slate-900"
            )}
            onClick={() => {
              setKeyPressType("press");
            }}
          >
            Press
          </button>
          <button
            className={classnames(
              "nodrag m-auto rounded px-2 hover:cursor-pointer",
              keyPressType == "release"
                ? "outline outline-blue-300"
                : "bg-slate-900"
            )}
            onClick={() => {
              setKeyPressType("release");
            }}
          >
            Release
          </button>
        </div>
        <div className="flex w-full justify-end gap-2">
          <SelectDropDown
            setSelected={(v) => setCurKey(v)}
            items={{ Keys: ["w", "a", "s", "d"], Other: ["space", "enter"] }}
            defaultValue={curKey}
          />
          <LabelHandle
            id={OUT_HANDLE_1}
            position={Position.Right}
            label="Value"
          />
        </div>
      </NodeContent>
    </div>
  );
});

export default KeyPress;
