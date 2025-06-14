"use client"

import { ArrowUpRight } from "lucide-react"

export function TopPerformers() {
  const performers = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      logo: "🟠",
      change: 12.5,
      value: 1985.45,
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      logo: "🔷",
      change: 5.7,
      value: 582.44,
    },
  ]

  return (
    <div className="space-y-4">
      {performers.map((coin, index) => (
        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg mr-3">
              {coin.logo}
            </div>
            <div>
              <div className="font-medium">{coin.name}</div>
              <div className="text-sm text-gray-500">{coin.symbol}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">${coin.value.toFixed(2)}</div>
            <div className="flex items-center text-sm text-green-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              {coin.change}%
            </div>
          </div>
        </div>
      ))}

      <div className="pt-2 text-sm text-gray-500">Based on performance over the last 30 days</div>
    </div>
  )
}
