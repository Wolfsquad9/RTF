"use client"

import React, { useCallback } from "react"
import { usePlanner } from "@/hooks/use-planner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface WeekHeaderProps {
  weekId: string
}

export function WeekHeader({ weekId }: WeekHeaderProps) {
  const { state, updateWeek } = usePlanner()

  const weekIndex = state.weeks.findIndex((w) => w.id === weekId)
  if (weekIndex === -1) return null

  const week = state.weeks[weekIndex]

  const handleObjectiveChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateWeek(weekIndex, { objective: e.target.value })
    },
    [weekIndex, updateWeek]
  )

  return (
    <Card className="border-zinc-800 bg-zinc-950/50 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-amber-500 uppercase tracking-wider">
          Week {week.number}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor={`week-${week.id}-objective`} className="text-sm text-zinc-400">
            Weekly Objective
          </Label>
          <Input
            id={`week-${week.id}-objective`}
            value={week.objective || ""}
            onChange={handleObjectiveChange}
            className="bg-zinc-900 border-zinc-800 text-base"
            placeholder="What's your focus this week?"
          />
        </div>
      </CardContent>
    </Card>
  )
}
