"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { PlannerState, Week, DayEntry, RPE } from "@/types/planner"
import { loadState, saveState, clearState } from "@/lib/storage"
import { generateInitialState } from "@/lib/planner-utils"

type UpdateDayFn = (weekIndex: number, dayIndex: number, updates: Partial<DayEntry>) => void
type UpdateMetricFn = (key: keyof NonNullable<PlannerState["coreMetrics"]>, value: number) => void
type UpdateExerciseFn = (weekIndex: number, dayIndex: number, exerciseIndex: number, field: string, value: any) => void
type UpdateWeekFn = (weekIndex: number, patch: Partial<Week>) => void

interface PlannerContextType {
  state: PlannerState
  isLoading: boolean
  updateMetric: UpdateMetricFn
  updateDay: UpdateDayFn
  updateExercise: UpdateExerciseFn
  updateWeek: UpdateWeekFn
  resetPlanner: () => void
  exportJSON: () => string
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined)

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [state, setState] = useState<PlannerState>(() => generateInitialState())

  useEffect(() => {
    try {
      const loaded = loadState()
      if (loaded) {
        setState(loaded)
      }
    } catch (e) {
      console.error("Failed to load planner state:", e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      try {
        saveState(state)
      } catch (e) {
        console.error("Failed to save state:", e)
      }
    }
  }, [state, isLoading])

  const updateMetric: UpdateMetricFn = useCallback((key, value) => {
    setState(prev => ({
      ...prev,
      coreMetrics: { ...(prev.coreMetrics || {}), [key]: value },
      lastSavedAt: new Date().toISOString()
    }))
  }, [])

  const updateDay: UpdateDayFn = useCallback((weekIndex, dayIndex, updates) => {
    setState(prev => {
      const weeks = [...prev.weeks]
      const week = { ...weeks[weekIndex] }
      const days = [...week.days]
      days[dayIndex] = { ...days[dayIndex], ...updates }
      week.days = days
      weeks[weekIndex] = week
      
      return {
        ...prev,
        weeks,
        lastSavedAt: new Date().toISOString()
      }
    })
  }, [])

  const updateExercise: UpdateExerciseFn = useCallback((weekIndex, dayIndex, exerciseIndex, field, value) => {
    setState(prev => {
      const weeks = [...prev.weeks]
      const week = { ...weeks[weekIndex] }
      const days = [...week.days]
      const day = { ...days[dayIndex] }
      const training = [...(day.training || [])]
      training[exerciseIndex] = { ...training[exerciseIndex], [field]: value }
      day.training = training
      days[dayIndex] = day
      week.days = days
      weeks[weekIndex] = week
      
      return {
        ...prev,
        weeks,
        lastSavedAt: new Date().toISOString()
      }
    })
  }, [])

  const updateWeek: UpdateWeekFn = useCallback((weekIndex, patch) => {
    setState(prev => {
      const weeks = [...prev.weeks]
      weeks[weekIndex] = { ...weeks[weekIndex], ...patch }
      
      return {
        ...prev,
        weeks,
        lastSavedAt: new Date().toISOString()
      }
    })
  }, [])

  const resetPlanner = useCallback(() => {
    if (confirm("Reset all data? This is unrecoverable.")) {
      clearState()
      setState(generateInitialState())
    }
  }, [])

  const exportJSON = useCallback(() => {
    return JSON.stringify(state, null, 2)
  }, [state])

  return (
    <PlannerContext.Provider
      value={{
        state,
        isLoading,
        updateMetric,
        updateDay,
        updateExercise,
        updateWeek,
        resetPlanner,
        exportJSON,
      }}
    >
      {children}
    </PlannerContext.Provider>
  )
}

export function usePlanner() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error("usePlanner must be used inside PlannerProvider")
  return ctx
}
