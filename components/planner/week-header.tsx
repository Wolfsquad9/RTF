"use client"

import React, { useCallback } from "react"
import { usePlanner } from "@/hooks/use-planner"

interface WeekHeaderProps {
  weekId: string
}

export function WeekHeader({ weekId }: WeekHeaderProps) {
  const { state, dispatch } = usePlanner()

  if (!state) return null

  const weekIndex = state.weeks.findIndex((w) => w.id === weekId)
  if (weekIndex === -1) return null

  const week = state.weeks[weekIndex]

  // Clean controlled update of the weekly objective
  const updateObjective = useCallback(
    (value: string) => {
      const updatedWeeks = [...state.weeks]
      updatedWeeks[weekIndex] = {
        ...updatedWeeks[weekIndex],
        objective: value
      }

      dispatch({
        type: "DIRECT_STATE_UPDATE",
        payload: { weeks: updatedWeeks }
      })
    },
    [state, weekIndex, dispatch]
  )

  return (
    <div className="week-header">
      <div className="week-header-top">
        <h2 className="week-title">Week {week.number}</h2>
      </div>

      <div className="week-objective">
        <label className="label">Weekly Objective</label>
        <input
          type="text"
          className="week-input"
          value={week.objective || ""}
          onChange={(e) => updateObjective(e.target.value)}
          placeholder="Enter your focus for this week"
        />
      </div>

      <style jsx>{`
        .week-header {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          background: var(--background-secondary);
        }

        .week-title {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 600;
        }

        .week-objective {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .label {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .week-input {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background: var(--background);
        }
      `}</style>
    </div>
  )
}
