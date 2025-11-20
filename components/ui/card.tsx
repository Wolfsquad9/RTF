import * as React from "react"

// Define the component's props, extending standard HTML div element props
export type CardProps = React.ComponentPropsWithoutRef<"div">

// Use forwardRef to allow the component to receive a ref
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    // The div component will receive any custom classNames and other standard props
    <div
      ref={ref}
      className={className} // Tailwind classes can be passed via className
      {...props}
    />
  )
)

// Set a display name for easier debugging
Card.displayName = "Card"

export { Card }
