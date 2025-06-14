"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Bitcoin", value: 75, color: "#F7931A" },
  { name: "Ethereum", value: 25, color: "#627EEA" },
]

export function PortfolioBreakdown() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="w-full max-w-[180px] h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Allocation"]}
              contentStyle={{ borderRadius: "8px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-4 w-full">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">${(item.value * 25.6789).toFixed(2)}</span>
              <span className="font-medium">{item.value}%</span>
            </div>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t flex items-center justify-between">
          <span className="font-medium">Total</span>
          <span className="font-medium">$2,567.89</span>
        </div>
      </div>
    </div>
  )
}
