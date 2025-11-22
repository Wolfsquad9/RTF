"use client"

import { useMemo, useRef } from "react"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { usePlanner } from "@/hooks/use-planner"
import { DailyLog } from "./daily-log"
import { WeekHeader } from "./week-header"
import { CoreMetrics } from "./core-metrics"

type ListItem =
  // 💡 CORRECTED: IDs must be string, matching lib/planner-utils.ts
  | { type: "metrics" }
  | { type: "week-header"; weekId: string }
  | { type: "day"; dayId: string; weekId: string }

export function PlannerList() {
  const { state } = usePlanner()
  const listRef = useRef<HTMLDivElement>(null)

  // Flatten the structure for virtualization
  const items = useMemo(() => {
    const list: ListItem[] = [{ type: "metrics" }]

    state.weeks.forEach((week) => {
      // NOTE: week.id is a string (e.g., "week-1")
      list.push({ type: "week-header", weekId: week.id }) 
      week.days.forEach((day) => {
        // NOTE: day.id is a string (e.g., "w1-d1")
        list.push({ type: "day", dayId: day.id, weekId: week.id }) 
      })
    })

    return list
  }, [state.weeks])

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
                {/* Rendering components now receive string IDs */}
                {item.type === "week-header" && <WeekHeader weekId={item.weekId} />}
                {item.type === "day" && <DailyLog dayId={item.dayId} weekId={item.weekId} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
