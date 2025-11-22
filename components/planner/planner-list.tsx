"use client"

import { useMemo, useRef } from "react"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { usePlanner } from "@/hooks/use-planner"
import { DailyLog } from "./daily-log"
import { WeekHeader } from "./week-header"
import { CoreMetrics } from "./core-metrics"

type ListItem =
  | { type: "metrics" }
  | { type: "week-header"; weekIndex: number }
  | { type: "day"; weekIndex: number; dayIndex: number }

export function PlannerList() {
  const { state } = usePlanner()
  const listRef = useRef<HTMLDivElement>(null)

  const items = useMemo(() => {
    const list: ListItem[] = [{ type: "metrics" }]

    state.weeks.forEach((week, weekIndex) => {
      list.push({ type: "week-header", weekIndex })
      week.days.forEach((day, dayIndex) => {
        list.push({ type: "day", weekIndex, dayIndex })
      })
    })

    return list
  }, [state.weeks])

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: (index) => {
      const item = items[index]
      if (item.type === "metrics") return 400
      if (item.type === "week-header") return 150
      return 800
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
