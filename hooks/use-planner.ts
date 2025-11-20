"use client"

import { useState, useEffect, useCallback, createContext, useContext } from "react" // <-- IMPORT CONTEXT
import type { PlannerState, Week, DayEntry } from "@/types/planner"
import { loadState, saveState, clearState } from "@/lib/storage"
import { addDays, startOfWeek } from "date-fns"

// ... (Rest of your existing code remains here: DEFAULT_WEEKS_COUNT and generateInitialState)
const DEFAULT_WEEKS_COUNT = 12
// ... (Your generateInitialState function)

// --- Define the Context Interface ---
// The return type of usePlanner() becomes the Context Value
type PlannerContextType = ReturnType<typeof usePlanner> | undefined

// --- Define the Context ---
const PlannerContext = createContext<PlannerContextType>(undefined)

// --- 1. Export the usePlanner Hook ---
export const usePlanner = () => { // <--- usePlanner is exported
  const [state, setState] = useState<PlannerState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ... (Your existing useEffect, updateMetric, updateDay, etc. logic)

  // useEffect for loading/initial state
  useEffect(() => {
    const loaded = loadState()
    if (loaded) {
      setState(loaded)
    } else {
      setState(generateInitialState())
    }
    setIsLoading(false)
  }, [])

  // useEffect for saving state
  useEffect(() => {
    if (state && !isLoading) {
      saveState(state)
    }
  }, [state, isLoading])

  // updateMetric logic
  const updateMetric = useCallback((key: keyof NonNullable<PlannerState["coreMetrics"]>, value: number) => {
    setState((prev) => {
      if (!prev) return null
      return {
        ...prev,
        coreMetrics: { ...prev.coreMetrics, [key]: value },
      }
    })
  }, [])
  
  // updateDay logic
  const updateDay = useCallback((weekIndex: number, dayIndex: number, updates: Partial<DayEntry>) => {
    setState((prev) => {
      if (!prev) return null
      const newWeeks = [...prev.weeks]
      const newDays = [...newWeeks[weekIndex].days]
      newDays[dayIndex] = { ...newDays[dayIndex], ...updates }
      newWeeks[weekIndex] = { ...newWeeks[weekIndex], days: newDays }
      return { ...prev, weeks: newWeeks }
    })
  }, [])

  // updateExercise logic
  const updateExercise = useCallback(
    (weekIndex: number, dayIndex: number, exerciseIndex: number, field: string, value: any) => {
      setState((prev) => {
        if (!prev) return null
        const newWeeks = [...prev.weeks]
        const newDays = [...newWeeks[weekIndex].days]
        const newTraining = [...(newDays[dayIndex].training || [])]
        newTraining[exerciseIndex] = {
          ...newTraining[exerciseIndex],
          [field]: value,
        }
        newDays[dayIndex] = { ...newDays[dayIndex], training: newTraining }
        newWeeks[weekIndex] = { ...newWeeks[weekIndex], days: newDays }
        return { ...prev, weeks: newWeeks }
      })
    },
    [],
  )

  // resetPlanner logic
  const resetPlanner = useCallback(() => {
    if (confirm("Are you sure you want to reset all data?")) {
      clearState()
      setState(generateInitialState())
    }
  }, [])

  // Return object for the Hook
  return {
    state,
    isLoading,
    weeks: state?.weeks || [], // <-- IMPORTANT: Provide the 'weeks' property
    updateMetric,
    updateDay,
    updateExercise,
    resetPlanner,
  }
}


// --- 2. Export the PlannerProvider Component ---
export const PlannerProvider = ({ children }: { children: React.ReactNode }) => { // <--- PlannerProvider is exported
  const planner = usePlanner()
  
  // Since the prerendering fails on null/undefined state, we must wait for it to load.
  if (planner.isLoading || !planner.state) { 
    return null; // Or a simple Loading... component if you have one
  }

  // Provide the state via Context
  return (
    <PlannerContext.Provider value={planner}>
      {children}
    </PlannerContext.Provider>
  )
}

// --- 3. Export a simpler usePlanner Hook (Best Practice) ---
// This ensures that all consuming components get the value from the Context.
export const usePlannerContext = () => {
  const context = useContext(PlannerContext)
  if (context === undefined) {
    throw new Error("usePlannerContext must be used within a PlannerProvider")
  }
  return context
}
