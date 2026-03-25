import * as React from "react"

import { cn } from "@/shared/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input bg-input flex h-10 w-full min-w-0 rounded-md border px-3 py-2 text-sm transition-[border-color,box-shadow,background-color] duration-[var(--duration-normal)] ease-[var(--ease-default)] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "aria-invalid:ring-destructive aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
