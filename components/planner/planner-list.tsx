"use client"

import React, { useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { usePlanner } from "@/hooks/use-planner"
import { CoreMetrics } from "./core-metrics"
import { WeekHeader } from "./week-header"
import { DailyLog } from "./daily-log"

export function PlannerList() {
  const { state, updateMetric, updateDay, updateExercise } = usePlanner()
  const listRef = useRef<HTMLDivElement | null>(null)

  if (!state) return null

  // Build a flat list representation for virtualization
  const items: Array<{
    type: "metrics" | "week-header" | "day"
    weekId?: string
    dayId?: string
  }> = []

  // First block: metrics
  items.push({ type: "metrics" })

  // Then weeks + days
  state.weeks.forEach((week) => {
    items.push({ type: "week-header", weekId: week.id })
    week.days.forEach((day) => {
      items.push({
        type: "day",
        weekId: week.id,
        dayId: day.id,
      })
    })
  })

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 260
  })

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div
      ref={listRef}
      style={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
        position: "relative"
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: "100%",
          position: "relative"
        }}
      >
        {virtualItems.map((virtualRow) => {
          const item = items[virtualRow.index]
          const style = {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualRow.start}px)`
          }

          // Metrics
          if (item.type === "metrics") {
            return (
              <div key="metrics" style={style}>
                <CoreMetrics metrics={state.coreMetrics} onUpdate={updateMetric} />
              </div>
            )
          }

          // Week header
          if (item.type === "week-header" && item.weekId) {
            return (
              <div key={item.weekId} style={style}>
                <WeekHeader weekId={item.weekId} />
              </div>
            )
          }

          // Day entry
          if (item.type === "day" && item.weekId && item.dayId) {
            const weekIndex = state.weeks.findIndex((w) => w.id === item.weekId)
            const week = state.weeks[weekIndex]

            const dayIndex = week.days.findIndex((d) => d.id === item.dayId)
            const day = week.days[dayIndex]

            return (
              <div key={item.dayId} style={style}>
                <DailyLog
                  weekIndex={weekIndex}
                  dayIndex={dayIndex}
                  day={day}
                  onUpdateDay={updateDay}
                  onUpdateExercise={updateExercise}
                />
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
