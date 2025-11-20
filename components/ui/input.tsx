import * as React from "react"

// Define the component's props, extending standard HTML input element props
export type InputProps = React.ComponentPropsWithoutRef<"input">

// Use forwardRef to allow the component to receive a ref
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={className} // Tailwind classes can be passed via className
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
