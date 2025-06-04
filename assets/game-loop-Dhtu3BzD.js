const e=`---
title: Game Loop
---

## Game Loop

If physical time matches animation time, we call this a **real-time system**.
In such systems, object states must be updated continuously — this is known as the **Game Loop**.

Ideally, the time required to update all objects and render the scene remains constant.
However, due to background processes and other factors, update and render durations vary with time:
$u(t)$ for updates and $r(t)$ for rendering.


**Figure:**
Frame duration $\\Delta t$ for various update $u(t)$ and rendering $r(t)$ times.

![Frameduration in a Game Loop](/docs/game-loop.png)


If updates and rendering complete faster than the frame duration, the system simply waits for the frame to end (*sleep timer*).

If updates $u(t)$ and rendering $r(t)$ take longer than the frame duration $\\Delta t$, there are two options:

* **Extend the frame duration**: If a frame takes too long, delay the next frame by
  $\\Delta t - (u(t) + r(t))$.
* **Wait for the next frame start**: After rendering finishes, wait until the next scheduled frame start.

In both implementations, if updates and rendering take too long, the **visual result suffers**, possibly leading to stuttering or a loss of smooth animation.
`;export{e as default};
