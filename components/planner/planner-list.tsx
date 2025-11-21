// components/planner/planner-list.tsx (excerpt)
"use client"

import React, { useRef, useMemo } from "react"
import { usePlanner } from "@/hooks/use-planner"
import CoreMetrics from "./core-metrics"
import WeekHeader from "./week-header"
import DailyLog from "./daily-log"
import { useVirtualizer } from "@tanstack/react-virtual"

export default function PlannerList() {
  const { state, updateMetric, updateDay, updateExercise } = usePlanner()
  const containerRef = useRef<HTMLDivElement | null>(null)

  const items = useMemo(() => {
    const out: Array<any> = []
    out.push({ type: "metrics" })
    state.weeks.forEach((w) => {
      out.push({ type: "week-header", weekId: w.id })
      w.days.forEach(d => {
        out.push({ type: "day", weekId: w.id, dayId: d.id })
      })
    })
    return out
  }, [state])

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => containerRef.current,
    estimateSize: index => {
      const item = items[index]
      if (item.type === "metrics") return 220
      if (item.type === "week-header") return 72
      return 120 // daily row
    },
  })

  return (
    <div ref={containerRef} style={{ height: "75vh", overflow: "auto" }}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map(vi => {
          const item = items[vi.index]
          const style: React.CSSProperties = {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${vi.start}px)`,
          }
          if (item.type === "metrics") {
            return (
              <div key="metrics" style={style}>
                <CoreMetrics metrics={state.coreMetrics} onUpdate={updateMetric} />
              </div>
            )
          }
          if (item.type === "week-header") {
            return (
              <div key={item.weekId} style={style}>
                <WeekHeader weekId={item.weekId} />
              </div>
            )
          }
          if (item.type === "day") {
            const weekIndex = state.weeks.findIndex(w => w.id === item.weekId)
            const dayIndex = state.weeks[weekIndex].days.findIndex(d => d.id === item.dayId)
            const day = state.weeks[weekIndex].days[dayIndex]
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
