"use client"

import { memo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { DayEntry } from "@/types/planner"
import { RPESelector } from "./rpe-selector"
import { cn } from "@/lib/utils"

interface DailyLogProps {
  weekIndex: number
  dayIndex: number
  day: DayEntry
  onUpdateDay: (weekIndex: number, dayIndex: number, updates: Partial<DayEntry>) => void
  onUpdateExercise: (weekIndex: number, dayIndex: number, exerciseIndex: number, field: string, value: any) => void
}

export const DailyLog = memo(function DailyLog({
  weekIndex,
  dayIndex,
  day,
  onUpdateDay,
  onUpdateExercise,
}: DailyLogProps) {
  const date = new Date(day.date)
  const isToday = new Date().toDateString() === date.toDateString()

  return (
    <Card className={cn("border-zinc-800 bg-zinc-950/50", isToday && "border-amber-500/50")}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold text-zinc-100">{format(date, "EEEE")}</CardTitle>
          <p className="text-xs text-zinc-500">{format(date, "MMM d, yyyy")}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">RPE</span>
          <RPESelector value={day.rpe} onChange={(val) => onUpdateDay(weekIndex, dayIndex, { rpe: val })} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Exercises Grid */}
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">
            <div className="col-span-5">Exercise</div>
            <div className="col-span-2 text-center">Sets</div>
            <div className="col-span-2 text-center">Reps</div>
            <div className="col-span-3 text-center">Load (kg)</div>
          </div>
          <div className="space-y-2">
            {day.training?.map((ex, idx) => (
              <div key={ex.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Input
                    value={ex.name}
                    onChange={(e) => onUpdateExercise(weekIndex, dayIndex, idx, "name", e.target.value)}
                    className="h-8 bg-zinc-900/50 border-zinc-800 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={ex.sets || ""}
                    onChange={(e) => onUpdateExercise(weekIndex, dayIndex, idx, "sets", Number(e.target.value))}
                    className="h-8 bg-zinc-900/50 border-zinc-800 text-center text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={ex.reps || ""}
                    onChange={(e) => onUpdateExercise(weekIndex, dayIndex, idx, "reps", Number(e.target.value))}
                    className="h-8 bg-zinc-900/50 border-zinc-800 text-center text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={ex.loadKg || ""}
                    onChange={(e) => onUpdateExercise(weekIndex, dayIndex, idx, "loadKg", Number(e.target.value))}
                    className="h-8 bg-zinc-900/50 border-zinc-800 text-center text-sm font-mono text-amber-500"
                    placeholder="-"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Habits */}
          <div className="space-y-3">
            <Label className="text-xs text-zinc-500 uppercase tracking-wider">Daily Habits</Label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(day.habits || {}).map(([key, checked]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${day.id}-${key}`}
                    checked={checked}
                    onCheckedChange={(c) => {
                      const newHabits = { ...day.habits, [key]: !!c }
                      onUpdateDay(weekIndex, dayIndex, { habits: newHabits })
                    }}
                    className="border-zinc-700 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                  <Label
                    htmlFor={`${day.id}-${key}`}
                    className="text-sm font-medium capitalize text-zinc-300 cursor-pointer"
                  >
                    {key}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-xs text-zinc-500 uppercase tracking-wider">Notes</Label>
            <Textarea
              value={day.notes || ""}
              onChange={(e) => onUpdateDay(weekIndex, dayIndex, { notes: e.target.value })}
              className="min-h-[80px] bg-zinc-900/50 border-zinc-800 text-sm resize-none"
              placeholder="How did it feel?"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
