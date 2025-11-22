"use client"

import { useState, useEffect, useCallback } from "react"
import type { PlannerState, Week, DayEntry } from "@/types/planner"
import { loadState, saveState, clearState } from "@/lib/storage"
import { addDays, startOfWeek } from "date-fns"

const DEFAULT_WEEKS_COUNT = 12

const generateInitialState = (): PlannerState => {
  const today = new Date()
  const start = startOfWeek(today, { weekStartsOn: 1 }) // Monday start
  const weeks: Week[] = []

  for (let i = 0; i < DEFAULT_WEEKS_COUNT; i++) {
    const weekStart = addDays(start, i * 7)
    const days: DayEntry[] = []
    for (let j = 0; j < 7; j++) {
      const date = addDays(weekStart, j)
      days.push({
        id: `w${i}-d${j}`,
        date: date.toISOString(),
        training: [
          { id: "ex1", name: "Squat", sets: 4, reps: 8 },
          { id: "ex2", name: "Bench Press", sets: 4, reps: 8 },
          { id: "ex3", name: "Deadlift", sets: 3, reps: 5 },
          { id: "ex4", name: "Overhead Press", sets: 3, reps: 8 },
          { id: "ex5", name: "Pull Ups", sets: 3, reps: 10 },
          { id: "ex6", name: "Dips", sets: 3, reps: 10 },
        ],
        habits: {
          sleep: false,
          nutrition: false,
          hydration: false,
          mobility: false,
        },
      })
    }
    weeks.push({
      id: `week-${i}`,
      startDate: weekStart.toISOString(),
      days,
    })
  }

  return {
    programName: "Return to Form",
    weeks,
    coreMetrics: { heightCm: null, weightKg: null, bodyfat: null },
    lastSavedAt: new Date().toISOString(),
  }
}

export const usePlanner = () => {
  const [state, setState] = useState<PlannerState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loaded = loadState()
    if (loaded) {
      setState(loaded)
    } else {
      setState(generateInitialState())
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (state && !isLoading) {
      saveState(state)
    }
  }, [state, isLoading])

  const updateMetric = useCallback((key: keyof NonNullable<PlannerState["coreMetrics"]>, value: number) => {
    setState((prev) => {
      if (!prev) return null
      return {
        ...prev,
        coreMetrics: { ...prev.coreMetrics, [key]: value },
      }
    })
  }, [])

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

  const resetPlanner = useCallback(() => {
    if (confirm("Are you sure you want to reset all data?")) {
      clearState()
      setState(generateInitialState())
    }
  }, [])

  return {
    state,
    isLoading,
    updateMetric,
    updateDay,
    updateExercise,
    resetPlanner,
  }
}
