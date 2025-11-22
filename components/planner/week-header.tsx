"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePlanner } from "@/hooks/use-planner"

interface WeekHeaderProps {
  weekIndex: number
}

export function WeekHeader({ weekIndex }: WeekHeaderProps) {
  const { state, dispatch } = usePlanner()
  const week = state.weeks[weekIndex]

  if (!week) return null

  const weekNumber = weekIndex + 1

  return (
    <div className="py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-primary">WEEK {weekNumber}</h2>
        <div className="text-sm text-muted-foreground">{(((weekNumber - 1) / 12) * 100).toFixed(0)}% COMPLETE</div>
      </div>

      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Weekly Objective</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor={`week-${weekNumber}-objective`} className="sr-only">
              Objective
            </Label>
            <Input
              id={`week-${weekNumber}-objective`}
              placeholder="Enter your main focus for this week..."
              defaultValue=""
              className="bg-background/50 border-primary/20 focus-visible:ring-primary"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
