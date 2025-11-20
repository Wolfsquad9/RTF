"use client"
import React from "react"
import "./planner.css"
import { PlannerApp } from "@/components/planner/planner-app"

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PlannerApp />
    </main>
  )
}