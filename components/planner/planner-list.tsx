"use client"

import { useMemo, useRef } from "react"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { usePlanner } from "@/hooks/use-planner"
import { DailyLog } from "./daily-log"
import { WeekHeader } from "./week-header"
import { CoreMetrics } from "./core-metrics"

type ListItem =
  // 💡 CORRECTED: Use Index-based items to match child components (WeekHeader, DailyLog)
  | { type: "metrics" }
  | { type: "week-header"; weekIndex: number }
  | { type: "day"; weekIndex: number; dayIndex: number }

export function PlannerList() {
  const { state } = usePlanner()
  const listRef = useRef<HTMLDivElement>(null)

  // Flatten the structure for virtualization
  const items = useMemo(() => {
    const list: ListItem[] = [{ type: "metrics" }]

    // Use indices for component lookup (matches WeekHeaderProps and DailyLogProps)
    state.weeks.forEach((week, weekIndex) => { 
      list.push({ type: "week-header", weekIndex }) 
      week.days.forEach((day, dayIndex) => {
        list.push({ type: "day", weekIndex, dayIndex })
      })
    })

    return list
  }, [state.weeks])
  // ... (rest of the code is identical)

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: (index) => {
      const item = items[index]
      if (item.type === "metrics") return 800
      if (item.type === "week-header") return 200
      return 1200
    },
    overscan: 2,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  })

  return (
    <div ref={listRef} className="max-w-4xl mx-auto px-4 pb-20">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index]

          return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="pb-8">
                {item.type === "metrics" && <CoreMetrics />}
                {/* 💡 Rendering components now receive index props (matches FIX 5 and FIX 6) */}
                {item.type === "week-header" && <WeekHeader weekIndex={item.weekIndex} />}
                {item.type === "day" && <DailyLog weekIndex={item.weekIndex} dayIndex={item.dayIndex} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
