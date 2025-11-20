// components/PlannerWrapper.tsx
"use client"

import * as React from 'react'
import { PlannerProvider } from '@/hooks/use-planner'
import { PlannerApp } from '@/components/planner/planner-app'

// This component solely exists to wrap the PlannerApp with the PlannerProvider
export function PlannerWrapper() {
  return (
    <PlannerProvider>
      <PlannerApp />
    </PlannerProvider>
  )
}
