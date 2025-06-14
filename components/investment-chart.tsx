"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useScreenSize } from "../hooks/use-screen-size"

interface InvestmentChartProps {
  timeframe: string
}

export function InvestmentChart({ timeframe }: InvestmentChartProps) {
  const [data, setData] = useState<any[]>([])
  const { isMobile, isTablet, width } = useScreenSize()

  useEffect(() => {
    // Generate data based on timeframe
    const generateData = () => {
      const newData = []
      let days = 30

      switch (timeframe) {
        case "1W":
          days = 7
          break
        case "1M":
          days = 30
          break
        case "3M":
          days = 90
          break
        case "1Y":
          days = 365
          break
        case "ALL":
          days = 730
          break
      }

      let value = 2000
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      for (let i = 0; i < days; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)

        // Simulate some volatility
        const change = (Math.random() - 0.45) * 50
        value += change

        // Ensure value doesn't go below 1800
        if (value < 1800) value = 1800 + Math.random() * 50

        newData.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value: Math.round(value * 100) / 100,
        })
      }

      return newData
    }

    setData(generateData())
  }, [timeframe])

  // Calculate responsive chart settings
  const getXAxisTickInterval = () => {
    if (isMobile) {
      // Show fewer ticks on mobile
      if (timeframe === "1W") return 1
      if (timeframe === "1M") return 7
      if (timeframe === "3M") return 30
      if (timeframe === "1Y") return 90
      return 180
    } else if (isTablet) {
      // Show more ticks on tablet
      if (timeframe === "1W") return 1
      if (timeframe === "1M") return 5
      if (timeframe === "3M") return 15
      if (timeframe === "1Y") return 60
      return 120
    } else {
      // Show most ticks on desktop
      if (timeframe === "1W") return 1
      if (timeframe === "1M") return 3
      if (timeframe === "3M") return 10
      if (timeframe === "1Y") return 30
      return 60
    }
  }

  // Calculate responsive margins
  const getMargins = () => {
    if (isMobile) {
      return { top: 5, right: 5, left: 5, bottom: 5 }
    } else if (isTablet) {
      return { top: 5, right: 10, left: 10, bottom: 5 }
    } else {
      return { top: 5, right: 20, left: 20, bottom: 10 }
    }
  }

  // Calculate font size based on screen width
  const getFontSize = () => {
    if (width < 400) return 8
    if (width < 600) return 10
    return 12
  }

  const xAxisInterval = getXAxisTickInterval()
  const margins = getMargins()
  const fontSize = getFontSize()

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={margins}>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize }}
            tickFormatter={(value, index) => {
              // Show ticks based on screen size and timeframe
              if (index % xAxisInterval === 0) {
                return isMobile ? value.split(" ")[0] : value // On mobile, only show day or month
              }
              return ""
            }}
            minTickGap={15} // Prevent overlapping ticks
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize }}
            tickFormatter={(value) => {
              // Format Y-axis values based on screen size
              if (isMobile) {
                // Simplified format for mobile
                if (value >= 1000) {
                  return `$${Math.floor(value / 1000)}k`
                }
                return `$${value}`
              }
              return `$${value}`
            }}
            domain={["dataMin - 100", "dataMax + 100"]}
            width={isMobile ? 30 : 40} // Adjust width based on screen size
            tickCount={isMobile ? 3 : 5} // Fewer ticks on mobile
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Value"]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              borderRadius: "8px",
              fontSize: fontSize,
              padding: isMobile ? "4px" : "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#FF6B9D"
            strokeWidth={isMobile ? 1.5 : 2}
            dot={false}
            activeDot={{ r: isMobile ? 4 : 6, fill: "#FF6B9D", stroke: "#fff", strokeWidth: isMobile ? 1 : 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
