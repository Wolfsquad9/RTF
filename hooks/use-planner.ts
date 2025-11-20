"use client"

import { useState, useEffect, useCallback, createContext, useContext } from "react"
// Note: You must have created or copied the missing files:
// "@/types/planner"
// "@/lib/storage"

// ... (Rest of your existing code remains here: DEFAULT_WEEKS_COUNT and generateInitialState)

// --- Define the Context Interface ---
// The return type of usePlanner() becomes the Context Value
type PlannerContextType = ReturnType<typeof usePlanner>

// --- Define the Context ---
// Initialize with a throwaway value instead of 'undefined' to simplify type handling 
const PlannerContext = createContext<PlannerContextType>({} as PlannerContextType)

// --- 1. Export the usePlanner Hook ---
// The components must use the values from this return object.
export const usePlanner = () => { 
  const [state, setState] = useState<PlannerState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // ... (All your existing updateMetric, updateDay, etc. logic)

  // useEffect for loading/initial state
  useEffect(() => {
    // ... (Your existing loadState/generateInitialState logic)
  }, [])

  // useEffect for saving state
  useEffect(() => {
    // ... (Your existing saveState logic)
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
        newDays[dayIndex] = { ...newDays[dayEntry], training: newTraining }
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


  // --- UPDATED RETURN OBJECT ---
  return {
    state,
    isLoading,
    // CRITICAL: Ensure 'weeks' is ALWAYS an array, even if state is null/loading.
    weeks: state?.weeks || generateInitialState().weeks, 
    updateMetric,
    updateDay,
    updateExercise,
    resetPlanner,
  }
}


// --- 2. Export the PlannerProvider Component ---
export const PlannerProvider = ({ children }: { children: React.ReactNode }) => {
  const planner = usePlanner()
  
  // This check MUST be here to prevent children from running before state is loaded.
  // If the component trying to read 'weeks' is a child, this will block it.
  if (planner.isLoading || !planner.state) { 
    return null; // Stop rendering children while loading
  }

  // Provide the state via Context
  return (
    <PlannerContext.Provider value={planner}>
      {children}
    </PlannerContext.Provider>
  )
}

// --- 3. Export the hook that consumers actually use ---
export const usePlannerContext = () => {
  const context = useContext(PlannerContext)
  if (Object.keys(context).length === 0) {
    // This catches the uninitialized context value
    throw new Error("usePlannerContext must be used within a PlannerProvider")
  }
  return context
}
