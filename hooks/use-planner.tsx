"use client"

// 🛠️ FIX 1: ADD useState TO THE IMPORTS
import { createContext, useContext, useReducer, useEffect, useState, ReactNode } from "react"
import type { PlannerState, Week, DayEntry } from "@/types/planner"
import { loadState, saveState, clearState } from "@/lib/storage"
import { generateInitialState } from "@/lib/planner-utils"

type PlannerAction =
  | { type: "SET_STATE"; payload: PlannerState }
  | { type: "UPDATE_METRIC"; payload: { key: keyof NonNullable<PlannerState["coreMetrics"]>; value: number } }
  | { type: "UPDATE_DAY"; payload: { weekIndex: number; dayIndex: number; updates: Partial<DayEntry> } }
  | { type: "UPDATE_EXERCISE"; payload: { weekIndex: number; dayIndex: number; exerciseIndex: number; field: string; value: any } }
  | { type: "UPDATE_WEEK_OBJECTIVE"; payload: { weekId: number; objective: string } }
  | { type: "RESET" }

function plannerReducer(state: PlannerState, action: PlannerAction): PlannerState {
  switch (action.type) {
    case "SET_STATE":
      return action.payload

    case "UPDATE_METRIC":
      return {
        ...state,
        coreMetrics: {
          ...state.coreMetrics,
          [action.payload.key]: action.payload.value,
        },
      }

    case "UPDATE_DAY": {
      const { weekIndex, dayIndex, updates } = action.payload
      const newWeeks = [...state.weeks]
      newWeeks[weekIndex] = {
        ...newWeeks[weekIndex],
        days: newWeeks[weekIndex].days.map((day, i) =>
          i === dayIndex ? { ...day, ...updates } : day
        ),
      }
      return { ...state, weeks: newWeeks }
    }

    case "UPDATE_EXERCISE": {
      const { weekIndex, dayIndex, exerciseIndex, field, value } = action.payload
      const newWeeks = [...state.weeks]
      const day = newWeeks[weekIndex].days[dayIndex]
      const newTraining = [...(day.training || [])]
      newTraining[exerciseIndex] = { ...newTraining[exerciseIndex], [field]: value }
      
      newWeeks[weekIndex] = {
        ...newWeeks[weekIndex],
        days: newWeeks[weekIndex].days.map((d, i) =>
          i === dayIndex ? { ...d, training: newTraining } : d
        ),
      }
      return { ...state, weeks: newWeeks }
    }

    case "UPDATE_WEEK_OBJECTIVE": {
      const { weekId, objective } = action.payload
      return {
        ...state,
        weeks: state.weeks.map((week) =>
          parseInt(week.id.split("-")[1]) === weekId
            ? { ...week, objective }
            : week
        ),
      }
    }

    case "RESET":
      return generateInitialState()

    default:
      return state
  }
}

interface PlannerContextType {
  state: PlannerState
  dispatch: React.Dispatch<PlannerAction>
  isLoading: boolean
  updateMetric: (key: keyof NonNullable<PlannerState["coreMetrics"]>, value: number) => void
  updateDay: (weekIndex: number, dayIndex: number, updates: Partial<DayEntry>) => void
  updateExercise: (weekIndex: number, dayIndex: number, exerciseIndex: number, field: string, value: any) => void
  resetPlanner: () => void
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined)

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(plannerReducer, generateInitialState())
  const [isLoading, setIsLoading] = useState(true)

  // 🛠️ FIX 2: TEMPORARILY COMMENT OUT CORRUPTED DATA LOADING
  // The 'loadState' function is likely reading old, incompatible data from localStorage
  // which overwrites the correct 'generateInitialState()' and causes the weeks array to be empty.
  useEffect(() => {
    // const loaded = loadState() 
    // if (loaded) {
    //   dispatch({ type: "SET_STATE", payload: loaded })
    // }
    setIsLoading(false)
  }, [])

  // The save hook will now save the clean data that was generated on first load.
  useEffect(() => {
    if (!isLoading) {
      saveState(state)
    }
  }, [state, isLoading])

  const updateMetric = (key: keyof NonNullable<PlannerState["coreMetrics"]>, value: number) => {
    dispatch({ type: "UPDATE_METRIC", payload: { key, value } })
  }

  const updateDay = (weekIndex: number, dayIndex: number, updates: Partial<DayEntry>) => {
    dispatch({ type: "UPDATE_DAY", payload: { weekIndex, dayIndex, updates } })
  }

  const updateExercise = (weekIndex: number, dayIndex: number, exerciseIndex: number, field: string, value: any) => {
    dispatch({ type: "UPDATE_EXERCISE", payload: { weekIndex, dayIndex, exerciseIndex, field, value } })
  }

  const resetPlanner = () => {
    if (confirm("Are you sure you want to reset all data?")) {
      clearState()
      dispatch({ type: "RESET" })
    }
  }

  return (
    <PlannerContext.Provider value={{ state, dispatch, isLoading, updateMetric, updateDay, updateExercise, resetPlanner }}>
      {children}
    </PlannerContext.Provider>
  )
}

export function usePlanner() {
  const context = useContext(PlannerContext)
  if (!context) throw new Error("usePlanner must be used within PlannerProvider")
  return context
}
