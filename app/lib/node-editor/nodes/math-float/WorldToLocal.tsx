import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import BaseHandle from "../../node-components/BaseHandle";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";
import { type nodeInputs, type nodeResults } from "../../node-store/node-store";
import { getInput } from "../../utils/compute";
import {
  IN_HANDLE_1,
  IN_HANDLE_2,
  IN_HANDLE_3,
  IN_HANDLE_4,
  IN_HANDLE_5,
  OUT_HANDLE_1,
  OUT_HANDLE_2,
} from "../constants";

const WorldToLocal = memo(({ id, data }: { id: string; data: any }) => {
  const { updateNodeData } = useReactFlow();

  const [pxDisplayData, setPXDisplayData] = useState(0);
  const [pyDisplayData, setPYDisplayData] = useState(0);
  const [oxDisplayData, setOXDisplayData] = useState(0);
  const [oyDisplayData, setOYDisplayData] = useState(0);
  const [orotDisplayData, setOROTDisplayData] = useState(0);

  const [pxInputData, setPXInputData] = useState<number>(data.pxInputData ?? 0);
  const [pyInputData, setPYInputData] = useState<number>(data.pyInputData ?? 0);
  const [oxInputData, setOXInputData] = useState<number>(data.oxInputData ?? 0);
  const [oyInputData, setOYInputData] = useState<number>(data.oyInputData ?? 0);
  const [orotInputData, setOROTInputData] = useState<number>(
    data.orotInputData ?? 0
  );

  useEffect(() => {
    updateNodeData(id, {
      compute: (inputs: nodeInputs, results: nodeResults) => {
        const px = getInput(inputs, IN_HANDLE_1, pxInputData);
        const py = getInput(inputs, IN_HANDLE_2, pyInputData);
        const ox = getInput(inputs, IN_HANDLE_3, oxInputData);
        const oy = getInput(inputs, IN_HANDLE_4, oyInputData);
        const orot = -getInput(inputs, IN_HANDLE_5, orotInputData);

        setPXDisplayData(px);
        setPYDisplayData(py);
        setOXDisplayData(ox);
        setOYDisplayData(oy);
        setOROTDisplayData(orot);

        const dx = px - ox;
        const dy = py - oy;
        const cos = Math.cos(orot);
        const sin = Math.sin(orot);

        results.set(OUT_HANDLE_1, dx * cos - dy * sin);
        results.set(OUT_HANDLE_2, dx * sin + dy * cos);
      },
      pxInputData,
      pyInputData,
      oxInputData,
      oyInputData,
      orotInputData,
    });
  }, [orotInputData, oxInputData, oyInputData, pxInputData, pyInputData]);

  return (
    <div className="min-w-3xs">
      <NodeContent label="World To Local" type="math" docsName="worldtolocal">
        <LabelHandle id={OUT_HANDLE_1} position={Position.Right} label="x" />
        <LabelHandle id={OUT_HANDLE_2} position={Position.Right} label="y" />
        <div className="text-left">
          Point X
          <NumberInput
            value={pxDisplayData}
            setValue={(v) => setPXInputData(v)}
            defaultValue={pxInputData}
            handleId={IN_HANDLE_1}
            type="float"
          />
          <BaseHandle id={IN_HANDLE_1} position={Position.Left} />
        </div>
        <div className="text-left">
          Point Y
          <NumberInput
            value={pyDisplayData}
            setValue={(v) => setPYInputData(v)}
            defaultValue={pyInputData}
            handleId={IN_HANDLE_2}
            type="float"
          />
          <BaseHandle id={IN_HANDLE_2} position={Position.Left} />
        </div>
        <div className="text-left">
          Origin X
          <NumberInput
            value={oxDisplayData}
            setValue={(v) => setOXInputData(v)}
            defaultValue={oxInputData}
            handleId={IN_HANDLE_3}
            type="float"
          />
          <BaseHandle id={IN_HANDLE_3} position={Position.Left} />
        </div>
        <div className="text-left">
          Origin Y
          <NumberInput
            value={oyDisplayData}
            setValue={(v) => setOYInputData(v)}
            defaultValue={oyInputData}
            handleId={IN_HANDLE_4}
            type="float"
          />
          <BaseHandle id={IN_HANDLE_4} position={Position.Left} />
        </div>
        <div className="text-left">
          Origin Rot
          <NumberInput
            value={orotDisplayData}
            setValue={(v) => setOROTInputData(v)}
            defaultValue={orotInputData}
            handleId={IN_HANDLE_5}
            type="float"
          />
          <BaseHandle id={IN_HANDLE_5} position={Position.Left} />
        </div>
      </NodeContent>
    </div>
  );
});

export default WorldToLocal;
