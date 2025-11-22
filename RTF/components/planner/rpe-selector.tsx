"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { RPE } from "@/types/planner"

interface RPESelectorProps {
  value?: RPE | null
  onChange: (value: RPE) => void
  disabled?: boolean
}

export function RPESelector({ value, onChange, disabled }: RPESelectorProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as RPE[]).map((rpe) => (
        <Button
          key={rpe}
          variant={value === rpe ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-8 w-8 p-0 font-mono text-xs",
            value === rpe
              ? "bg-amber-500 text-black hover:bg-amber-600"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => onChange(rpe)}
          disabled={disabled}
        >
          {rpe}
        </Button>
      ))}
    </div>
  )
}
