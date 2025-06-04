type Position =
  | { x: number; y: number; clientX: number; clientY: number }
  | undefined;

let position: Position = undefined;
let initialized = false;

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
  };
  const leave = () => {
    position = undefined;
  };

  container.addEventListener("mousemove", updatePosition);
  container.addEventListener("mouseleave", leave);

  return () => {
    container.removeEventListener("mousemove", updatePosition);
    container.removeEventListener("mouseleave", leave);
    initialized = false;
    position = undefined;
  };
}

function getPosition(): Position {
  return position;
}

export const flowMouseTracker = {
  init,
  getPosition,
};
