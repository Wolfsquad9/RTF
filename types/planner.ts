export type RPE = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface Exercise {
  id: string
  name: string
  sets?: number
  reps?: number
  loadKg?: number | null
}

export interface DayEntry {
  id: string
  date: string // ISO date string
  notes?: string
  completed?: boolean
  rpe?: RPE | null
  training?: Exercise[]
  habits?: Record<string, boolean>
}

export interface Week {
  id: string
  number: number // ADDED: Week number (1-12)
  startDate: string
  objective?: string // ADDED: Weekly objective
  days: DayEntry[]
}

export interface PlannerState {
  userId?: string | null
  programName?: string | null
  weeks: Week[]
  coreMetrics?: {
    heightCm?: number | null
    weightKg?: number | null
    bodyfat?: number | null
  }
  lastSavedAt?: string | null
}
