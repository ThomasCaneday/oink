"use client"

import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProjectedGrowth() {
  const [timeframe, setTimeframe] = useState("1y")

  // Generate projected growth data based on timeframe
  const getProjectedData = () => {
    const data = []
    let months = 12
    const initialValue = 2567.89
    const monthlyContribution = 100

    switch (timeframe) {
      case "1y":
        months = 12
        break
      case "3y":
        months = 36
        break
      case "5y":
        months = 60
        break
    }

    let currentValue = initialValue

    for (let i = 0; i <= months; i += months / 4) {
      const month = Math.round(i)
      // Simulate compound growth with some randomness
      const growthRate = 0.05 + Math.random() * 0.03
      currentValue = initialValue * Math.pow(1 + growthRate, month / 12) + monthlyContribution * month

      data.push({
        month: month === 0 ? "Now" : `${month}m`,
        value: Math.round(currentValue * 100) / 100,
      })
    }

    return data
  }

  const data = getProjectedData()

  return (
    <div className="space-y-4">
      <Tabs value={timeframe} onValueChange={setTimeframe} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="1y">1 Year</TabsTrigger>
          <TabsTrigger value="3y">3 Years</TabsTrigger>
          <TabsTrigger value="5y">5 Years</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Projected Value"]}
              contentStyle={{ borderRadius: "8px" }}
            />
            <Bar dataKey="value" fill="#FF6B9D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 text-sm text-gray-500">
        Projections based on historical performance and current investment patterns. Actual results may vary.
      </div>
    </div>
  )
}
