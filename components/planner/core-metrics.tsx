"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePlanner } from "@/hooks/use-planner"

export function CoreMetrics() {
  const { state, updateMetric } = usePlanner()
  const metrics = state.coreMetrics || {}

  return (
    <Card className="border-zinc-800 bg-zinc-950/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-amber-500 uppercase tracking-wider">Core Metrics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="height" className="text-xs text-zinc-400">
            Height (cm)
          </Label>
          <Input
            id="height"
            type="number"
            value={metrics.heightCm || ""}
            onChange={(e) => updateMetric("heightCm", Number(e.target.value))}
            className="bg-zinc-900 border-zinc-800 h-8 text-sm"
            placeholder="0"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="weight" className="text-xs text-zinc-400">
            Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            value={metrics.weightKg || ""}
            onChange={(e) => updateMetric("weightKg", Number(e.target.value))}
            className="bg-zinc-900 border-zinc-800 h-8 text-sm"
            placeholder="0.0"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="bodyfat" className="text-xs text-zinc-400">
            Body Fat %
          </Label>
          <Input
            id="bodyfat"
            type="number"
            value={metrics.bodyfat || ""}
            onChange={(e) => updateMetric("bodyfat", Number(e.target.value))}
            className="bg-zinc-900 border-zinc-800 h-8 text-sm"
            placeholder="0.0"
          />
        </div>
      </CardContent>
    </Card>
  )
}
