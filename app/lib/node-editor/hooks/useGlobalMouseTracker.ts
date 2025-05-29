// hooks/useMouseTrackingInPane.ts
import { useEffect } from "react";

import { flowMouseTracker } from "~/lib/game/utils/flowMouseTracker";

export function useMouseTrackingInPane(
  ref: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!ref.current) return;

    const cleanup = flowMouseTracker.init(ref.current);
    return () => cleanup?.();
  }, [ref]);
}
