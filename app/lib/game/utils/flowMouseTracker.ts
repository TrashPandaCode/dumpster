type Position =
  | { x: number; y: number; clientX: number; clientY: number }
  | undefined;

let position: Position = undefined;
let initialized = false;

const listeners = new Set<(pos: Position) => void>();

function init(container: HTMLElement) {
  if (initialized) return;
  initialized = true;

  const updatePosition = (e: MouseEvent) => {
    const bounds = container.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    if (x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height) {
      position = { x, y, clientX: e.clientX, clientY: e.clientY };
    } else {
      position = undefined;
    }

    listeners.forEach((cb) => cb(position));
  };

  const leave = () => {
    position = undefined;
    listeners.forEach((cb) => cb(position));
  };

  container.addEventListener("mousemove", updatePosition);
  container.addEventListener("mouseleave", leave);

  return () => {
    container.removeEventListener("mousemove", updatePosition);
    container.removeEventListener("mouseleave", leave);
    listeners.clear();
    initialized = false;
    position = undefined;
  };
}

function getPosition(): Position {
  return position;
}

function onChange(callback: (pos: Position) => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export const flowMouseTracker = {
  init,
  getPosition,
  onChange,
};
