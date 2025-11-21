// components/planner/planner-app.tsx
"use client"

import React from "react"
import { PlannerProvider } from "@/hooks/use-planner"
import PlannerLayout from "./planner-layout"
import PlannerList from "./planner-list"

export function PlannerApp() {
  return (
    <PlannerProvider>
      <PlannerLayout>
        <PlannerList />
      </PlannerLayout>
    </PlannerProvider>
  )
}
