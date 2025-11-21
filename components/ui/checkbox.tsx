// ============================================
// components/ui/checkbox.tsx
// ============================================
import * as React from "react"
import { cn } from "@/lib/utils"

export type CheckboxProps = Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onCheckedChange?.(e.target.checked)
    }
    
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={cn(
          "h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-950",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }

