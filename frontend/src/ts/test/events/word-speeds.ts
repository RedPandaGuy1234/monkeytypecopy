// Adds helpers to produce per-word speed labels for display above
// typed words. Implements the idea from discussion #8294:
// https://github.com/monkeytypegame/monkeytype/discussions/8294
//
// This module provides: raw per-word speeds, visibility helpers to show a
// label every N words, and averaged speeds over a trailing N-word window.

import type { EventLog } from "./types";
import { getWordBurstHistory } from "./stats";

// CSS class consumers can apply to the label element.
export const WORD_SPEED_LABEL_CLASS = "word-speed-label";

// Returns numeric speeds (WPM) per word in the test. Use for UI overlays.
export function getWordSpeeds(eventLog: EventLog): number[] {
  return getWordBurstHistory(eventLog);
}

// Returns formatted labels for display (empty string for 0/unknown).
// step: show label only for every `step` words (default 5).
// This uses the raw per-word speed (single-word burst) as reported by
// getWordSpeeds.
export function getWordSpeedLabels(eventLog: EventLog, step = 5): string[] {
  const speeds = getWordSpeeds(eventLog);
  return speeds.map((wpm, i) => {
    // Show label for words where (index+1) is a multiple of step.
    if ((i + 1) % step !== 0) return "";
    return wpm > 0 ? `${wpm} wpm` : "";
  });
}

// Returns a parallel boolean array indicating visibility of a label per word
// (useful if your renderer prefers a boolean rather than an empty string).
export function getWordSpeedVisibility(eventLog: EventLog, step = 5): boolean[] {
  return getWordSpeeds(eventLog).map((wpm, i) => (i + 1) % step === 0 && wpm > 0);
}

// Returns averaged speeds per-word using a trailing window of size `step`.
// If requireFullWindow is true, entries before the first full window are 0.
// The average ignores zero/unknown per-word speeds when computing the mean.
export function getAveragedWordSpeeds(
  eventLog: EventLog,
  step = 5,
  requireFullWindow = true,
): number[] {
  const speeds = getWordSpeeds(eventLog); // per-word WPM (may be 0)
  const averaged: number[] = [];

  for (let i = 0; i < speeds.length; i++) {
    const start = Math.max(0, i - (step - 1));
    const window = speeds.slice(start, i + 1);
    if (requireFullWindow && window.length < step) {
      averaged.push(0);
      continue;
    }
    const valid = window.filter((s) => s > 0);
    if (valid.length === 0) {
      averaged.push(0);
    } else {
      const sum = valid.reduce((a, b) => a + b, 0);
      averaged.push(Math.round(sum / valid.length));
    }
  }

  return averaged;
}

// Example label function: show averaged label every `step` words.
export function getAveragedWordSpeedLabels(
  eventLog: EventLog,
  step = 5,
  requireFullWindow = true,
): string[] {
  const averaged = getAveragedWordSpeeds(eventLog, step, requireFullWindow);
  return averaged.map((wpm, i) => {
    if ((i + 1) % step !== 0) return "";
    return wpm > 0 ? `${wpm} wpm` : "";
  });
}

export default getWordSpeeds;
