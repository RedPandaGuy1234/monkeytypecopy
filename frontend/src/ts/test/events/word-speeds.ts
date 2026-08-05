// Adds a small helper to produce per-word speed labels for display above
// typed words. Implements the idea from discussion #8294:
// https://github.com/monkeytypegame/monkeytype/discussions/8294

import type { EventLog } from "./types";
import { getWordBurstHistory } from "./stats";

// Returns numeric speeds (WPM) per word in the test. Use for UI overlays.
export function getWordSpeeds(eventLog: EventLog): number[] {
  return getWordBurstHistory(eventLog);
}

// Returns formatted labels for display (empty string for 0/unknown).
export function getWordSpeedLabels(eventLog: EventLog): string[] {
  return getWordSpeeds(eventLog).map((wpm) => (wpm > 0 ? `${wpm} wpm` : ""));
}

export default getWordSpeeds;
