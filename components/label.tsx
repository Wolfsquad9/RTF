import * as React from "react"

// Define the component's props, extending standard HTML label element props
export type LabelProps = React.ComponentPropsWithoutRef<"label">

// Use forwardRef for consistency, though often less critical for a label
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={className} // Tailwind classes can be passed via className
      {...props}
    />
  )
)

Label.displayName = "Label"

export { Label }
