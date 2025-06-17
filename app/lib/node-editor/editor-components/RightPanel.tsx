import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ClipboardIcon,
  CopyIcon,
  CubeIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { Panel, useReactFlow } from "@xyflow/react";
import { useState } from "react";

import { globalKeyTracker } from "~/lib/game/utils/globalKeyTracker";
import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { useFlowStore } from "../node-store/flow-store";
import { useLoopStore } from "../node-store/loop-store";
import { useNodeStore } from "../node-store/node-store";
import AddNodes from "./AddNodes";
import HelpMenu from "./HelpMenu";
import { IconButton } from "./IconButton";

const RightPanel = () => {
  const { getNodes, getEdges } = useReactFlow();

  const nodeStateDebugPrint = useNodeStore((state) => state.debugPrint);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Panel
      position="top-right"
      className="flex flex-col items-end justify-center gap-2"
    >
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <IconButton
            id="add-nodes"
            side="left"
            tooltip={
              <p>
                Add Node
                <span className="ml-2 rounded bg-slate-600 px-1.5 py-0.5 font-mono text-xs text-gray-300">
                  {globalKeyTracker.isMac ? "⌥+Space" : "Ctrl+Space"}
                </span>
              </p>
            }
            aria-label="Add Node"
          >
            <PlusIcon className="text-white" />
          </IconButton>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent align="end">
            <AddNodes
              onClose={() => setIsDropdownOpen(false)}
              x={1800}
              y={400}
            />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      <HelpMenu />

      {process.env.NODE_ENV === "development" && (
        <>
          <IconButton
            onClick={nodeStateDebugPrint}
            side="left"
            tooltip="Print Node State"
          >
            <CubeIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Print Nodes"
            side="left"
            onClick={() => {
              console.log(getNodes());
            }}
          >
            <CubeIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Print Edges"
            side="left"
            onClick={() => {
              console.log(getEdges());
            }}
          >
            <CubeIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Print Temporal State"
            side="left"
            onClick={() => {
              console.log(useFlowStore.temporal.getState());
            }}
          >
            <CubeIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Copy State"
            side="left"
            onClick={() => {
              const currentLevel = useGameStore.getState().currentLevel;
              const flowStore = localStorage.getItem(
                `flow-store-${currentLevel}`
              );
              const nodeStore = localStorage.getItem(
                `node-store-${currentLevel}`
              );
              const loopStore = localStorage.getItem(
                `loop-store-${currentLevel}`
              );
              const dataStore = localStorage.getItem(
                `data-store-${currentLevel}`
              );
              navigator.clipboard.writeText(
                JSON.stringify({
                  flowStore,
                  nodeStore,
                  loopStore,
                  dataStore,
                })
              );
            }}
          >
            <CopyIcon className="text-white" />
          </IconButton>
          <IconButton
            tooltip="Paste State"
            side="left"
            onClick={async () => {
              const stores = JSON.parse(await navigator.clipboard.readText());
              const currentLevel = useGameStore.getState().currentLevel;
              localStorage.setItem(
                `flow-store-${currentLevel}`,
                stores.flowStore
              );
              localStorage.setItem(
                `node-store-${currentLevel}`,
                stores.nodeStore
              );
              localStorage.setItem(
                `loop-store-${currentLevel}`,
                stores.loopStore
              );
              localStorage.setItem(
                `data-store-${currentLevel}`,
                stores.dataStore
              );

              useFlowStore.getState().init(currentLevel);
              useNodeStore.getState().init();
              useLoopStore.getState().init();
              useDataStore.getState().init(currentLevel);
            }}
          >
            <ClipboardIcon className="text-white" />
          </IconButton>
        </>
      )}
    </Panel>
  );
};

export default RightPanel;
