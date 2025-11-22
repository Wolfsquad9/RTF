"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { usePlanner } from "@/hooks/use-planner"
import { RPESelector } from "./rpe-selector"
import { cn } from "@/lib/utils"

interface DailyLogProps {
  weekIndex: number
  dayIndex: number
}

export function DailyLog({ weekIndex, dayIndex }: DailyLogProps) {
  const { state, updateDay, updateExercise } = usePlanner()
  const day = state.weeks[weekIndex]?.days[dayIndex]

  if (!day) return null

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
          <RPESelector value={day.rpe} onChange={(val) => updateDay(weekIndex, dayIndex, { rpe: val })} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
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
                    onChange={(e) => updateExercise(weekIndex, dayIndex, idx, "name", e.target.value)}
                    className="h-8 bg-zinc-900/50 border-zinc-800 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={ex.sets || ""}
                    onChange={(e) => updateExercise(weekIndex, dayIndex, idx, "sets", Number(e.target.value))}
                    className="h-8 bg-zinc-900/50 border-zinc-800 text-center text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={ex.reps || ""}
                    onChange={(e) => updateExercise(weekIndex, dayIndex, idx, "reps", Number(e.target.value))}
                    className="h-8 bg-zinc-900/50 border-zinc-800 text-center text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={ex.loadKg || ""}
                    onChange={(e) => updateExercise(weekIndex, dayIndex, idx, "loadKg", Number(e.target.value))}
                    className="h-8 bg-zinc-900/50 border-zinc-800 text-center text-sm font-mono text-amber-500"
                    placeholder="-"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-zinc-500 uppercase tracking-wider">Notes</Label>
          <Textarea
            value={day.notes || ""}
            onChange={(e) => updateDay(weekIndex, dayIndex, { notes: e.target.value })}
            className="min-h-[80px] bg-zinc-900/50 border-zinc-800 text-sm resize-none"
            placeholder="How did it feel?"
          />
        </div>
      </CardContent>
    </Card>
  )
}
