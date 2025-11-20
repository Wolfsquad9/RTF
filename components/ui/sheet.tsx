import * as React from "react"

// A Sheet is usually composed of Root, Trigger, Content, etc. 
// This is a minimal wrapper.
export type SheetProps = React.ComponentPropsWithoutRef<"div">

const Sheet = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="sheet-scaffold">
      {children}
    </div>
  )
}

// For use with Sheet-related components (like SheetContent, SheetTrigger)
const SheetContent = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  )
)

SheetContent.displayName = "SheetContent"

export { Sheet, SheetContent }
