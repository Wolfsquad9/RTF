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
import { Calendar, Flame } from "lucide-react"

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
    <Card className={cn(
      "border-zinc-800 bg-zinc-950/50 backdrop-blur transition-all hover:border-zinc-700",
      isToday && "border-amber-500/50 shadow-lg shadow-amber-500/10"
    )}>
      <CardHeader className="pb-4 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-lg font-bold text-zinc-100">
              {format(date, "EEEE")}
            </CardTitle>
            {isToday && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                TODAY
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-500">{format(date, "MMM d, yyyy")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-medium text-zinc-500">RPE</span>
          <RPESelector 
            value={day.rpe} 
            onChange={(val) => onUpdateDay(weekIndex, dayIndex, { rpe: val })} 
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Exercises Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">Workout Log</h3>
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">
            <div className="col-span-5">Exercise</div>
            <div className="col-span-2 text-center">Sets</div>
            <div className="col-span-2 text-center">Reps</div>
            <div className="col-span-3 text-center">Load (kg)</div>
          </div>
          <div className="space-y-2">
            {day.training?.map((ex, idx) => (
              <div key={ex.id} className="grid grid-cols-12 gap-2 items-center group">
                <div className="col-span-5">
                  <Input
                    value={ex.name}
                    onChange={(e) => onUpdateExercise(weekIndex, dayIndex, idx, "name", e.target.value)}
                    className="h-9 bg-zinc-900/50 border-zinc-800 text-sm group-hover:border-zinc-700 transition-colors"
                    placeholder="Exercise name"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={ex.sets || ""}
                    onChange={(e) => onUpdateExercise(weekIndex, dayIndex, idx, "sets", Number(e.target.value))}
                    className="h-9 bg-zinc-900/50 border-zinc-800 text-center text-sm group-hover:border-zinc-700 transition-colors"
                    placeholder="0"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={ex.reps || ""}
                    onChange={(e) => onUpdateExercise(weekIndex, dayIndex, idx, "reps", Number(e.target.value))}
                    className="h-9 bg-zinc-900/50 border-zinc-800 text-center text-sm group-hover:border-zinc-700 transition-colors"
                    placeholder="0"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={ex.loadKg || ""}
                    onChange={(e) => onUpdateExercise(weekIndex, dayIndex, idx, "loadKg", Number(e.target.value))}
                    className="h-9 bg-zinc-900/50 border-zinc-800 text-center text-sm font-mono text-amber-500 group-hover:border-zinc-700 transition-colors"
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
            <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">Daily Habits</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(day.habits || {}).map(([key, checked]) => (
                <div key={key} className="flex items-center space-x-2 group">
                  <Checkbox
                    id={`${day.id}-${key}`}
                    checked={checked}
                    onCheckedChange={(c) => {
                      const newHabits = { ...day.habits, [key]: !!c }
                      onUpdateDay(weekIndex, dayIndex, { habits: newHabits })
                    }}
                  />
                  <Label
                    htmlFor={`${day.id}-${key}`}
                    className="text-sm font-medium capitalize text-zinc-300 cursor-pointer group-hover:text-amber-500 transition-colors"
                  >
                    {key}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">Notes</h3>
            <Textarea
              value={day.notes || ""}
              onChange={(e) => onUpdateDay(weekIndex, dayIndex, { notes: e.target.value })}
              className="min-h-[100px] bg-zinc-900/50 border-zinc-800 text-sm resize-none hover:border-zinc-700 transition-colors"
              placeholder="How did today's session feel? Any insights or observations..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
