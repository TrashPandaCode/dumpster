import { LEVELS } from "./levels";

// Initializes the game state
export const loadLevel = (level: string) => {
    if (!(level in LEVELS)) {
        throw new Error(`Level ${level} not found`);
    }
    LEVELS[level].initialState();
}