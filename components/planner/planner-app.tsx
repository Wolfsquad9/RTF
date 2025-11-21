"use client"

import React from "react"
import { PlannerLayout } from "./planner-layout"
import { PlannerList } from "./planner-list"

// FIXED: Removed duplicate PlannerProvider wrapping
// The provider is already in PlannerWrapper.tsx
export function PlannerApp() {
  return (
    <PlannerLayout>
      <PlannerList />
    </PlannerLayout>
  )
}
