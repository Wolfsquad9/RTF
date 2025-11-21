// ============================================
// components/ui/sheet.tsx
// ============================================
import * as React from "react"
import { cn } from "@/lib/utils"

export type SheetProps = React.ComponentPropsWithoutRef<"div">

const Sheet = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
  ({ className, children, ...props }, ref) => (
    <button ref={ref} className={className} {...props}>
      {children}
    </button>
  )
)
SheetTrigger.displayName = "SheetTrigger"

const SheetContent = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed inset-y-0 left-0 z-50 h-full w-3/4 gap-4 border-r bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        className
      )}
      {...props}
    />
  )
)
SheetContent.displayName = "SheetContent"

export { Sheet, SheetTrigger, SheetContent }
