export const IN_HANDLE_1: string = "input-handle-x";
export const IN_HANDLE_2: string = "input-handle-y";
export const IN_HANDLE_3: string = "input-handle-z";

export const OUT_HANDLE_1: string = "output-handle-x";
export const OUT_HANDLE_2: string = "output-handle-y";
export const OUT_HANDLE_3: string = "output-handle-z";

export const LOOP_CONNECTOR_OUT: string = "loop-connector-out";
export const LOOP_CONNECTOR_IN: string = "loop-connector-in";

// 1 -> x
// 2 -> y
// 3 -> z
// ...
const getIndex = (index: number) => String.fromCharCode(119 + index);

export const IN_HANDLE_X = (X: number) => `input-handle-${getIndex(X)}`;
export const OUT_HANDLE_X = (X: number) => `output-handle-${getIndex(X)}`;
