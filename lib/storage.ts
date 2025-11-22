// lib/storage.ts

import type { PlannerState } from "@/types/planner"

const STORAGE_KEY = "plannerState" // For reference, but not used

// Dummy functions that do nothing, guaranteeing no interference with localStorage

export function loadState(): PlannerState | undefined {
  console.warn("Storage is currently disabled to force a clean state.")
  return undefined // Always return undefined to force initial state generation
}

export function saveState(state: PlannerState) {
  // Do nothing
}

export function clearState() {
  // Do nothing
}
