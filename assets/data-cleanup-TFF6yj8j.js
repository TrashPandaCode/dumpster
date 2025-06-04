const e=`---
title: Data Cleanup and Post-Processing
---

## Data Cleanup and Post-Processing

* **Occlusion Problem**: Markers are often obscured by props or body parts, leading to gaps in data that must be interpolated.
* **Marker Swapping**: If two markers overlap exactly, the system may confuse them when they separate again (as markers are internally numbered).
* **Interference Signals**: Sensors may receive interference (e.g., light reflections), causing outliers.
* **Noise**: Small inaccuracies over many frames lead to background noise or signal spikes—data may need filtering.
`;export{e as default};
