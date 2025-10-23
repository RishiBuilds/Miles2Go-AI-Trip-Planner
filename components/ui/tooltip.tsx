"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Simple tooltip implementation without Radix UI dependency
function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function TooltipTrigger({ 
  children, 
  asChild,
  ...props 
}: { 
  children: React.ReactNode
  asChild?: boolean
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      {children}
    </div>
  )
}

function TooltipContent({
  className,
  children,
  ...props
}: {
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute z-50 bg-gray-900 text-white px-2 py-1 text-xs rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
