import * as React from "react"

export type CheckboxProps = React.ComponentPropsWithoutRef<"input">

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input 
      type="checkbox"
      className={className} 
      ref={ref} 
      {...props} 
    />
  )
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
