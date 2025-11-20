// components/ui/sheet.tsx (Updated Scaffold)
import * as React from "react"

export type SheetProps = React.ComponentPropsWithoutRef<"div">
export type ButtonProps = React.ComponentPropsWithoutRef<"button"> // Reusing ButtonProps type

// Sheet (Wrapper)
const Sheet = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="sheet-scaffold">
      {children}
    </div>
  )
}

// Sheet Content (Already added)
const SheetContent = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  )
)
SheetContent.displayName = "SheetContent"

// New Scaffold for SheetTrigger
const SheetTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <button ref={ref} className={className} {...props}>
      {children}
    </button>
  )
)
SheetTrigger.displayName = "SheetTrigger"

// Export all components needed
export { Sheet, SheetContent, SheetTrigger }
