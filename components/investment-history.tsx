"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, Coins } from "lucide-react"

interface Investment {
  id: string
  date: string
  amount: number
  cryptocurrency: string
  status: string
}

export function InvestmentHistory({ userId }: { userId: string }) {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch user data to get investment history
        const response = await fetch(`/api/user-data?userId=${userId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`)
        }

        const userData = await response.json()

        if (!userData.success) {
          throw new Error(userData.error || "Failed to fetch user data")
        }

        // In a real app, you would fetch investment history from a database
        // For this demo, we'll create some mock data if the user has made investments
        if (userData.data.lastInvestmentDate) {
          const mockInvestments: Investment[] = [
            {
              id: `invest-${Date.now()}`,
              date: userData.data.lastInvestmentDate,
              amount: userData.data.lastInvestmentAmount || 0,
              cryptocurrency: userData.data.lastInvestmentCoin || "BTC",
              status: "completed",
            },
          ]

          setInvestments(mockInvestments)
        }
      } catch (error) {
        console.error("Error fetching investments:", error)
        setError(`Error fetching investments: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvestments()
  }, [userId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment History</CardTitle>
        <CardDescription>Your automatic and manual investments</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4 bg-pink-50">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">
              All
            </TabsTrigger>
            <TabsTrigger value="auto" className="data-[state=active]:bg-white">
              Automatic
            </TabsTrigger>
            <TabsTrigger value="manual" className="data-[state=active]:bg-white">
              Manual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="text-center py-4">Loading investments...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : investments.length > 0 ? (
              <div className="space-y-4">
                {investments.map((investment) => (
                  <div
                    key={investment.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-pink-100 p-2">
                        <Coins className="h-4 w-4 text-pink-500" />
                      </div>
                      <div>
                        <div className="font-medium">{investment.cryptocurrency} Investment</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(investment.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-medium">${investment.amount.toFixed(2)}</div>
                      <div className="flex items-center text-sm text-green-500">
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                        Completed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">No investments found</div>
            )}
          </TabsContent>

          <TabsContent value="auto">
            {isLoading ? (
              <div className="text-center py-4">Loading investments...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : investments.length > 0 ? (
              <div className="space-y-4">
                {investments.map((investment) => (
                  <div
                    key={investment.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-pink-100 p-2">
                        <Coins className="h-4 w-4 text-pink-500" />
                      </div>
                      <div>
                        <div className="font-medium">Auto-Investment in {investment.cryptocurrency}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(investment.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-medium">${investment.amount.toFixed(2)}</div>
                      <div className="flex items-center text-sm text-green-500">
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                        Completed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">No automatic investments found</div>
            )}
          </TabsContent>

          <TabsContent value="manual">
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-medium">No manual investments yet</h3>
                <p className="text-sm text-muted-foreground">Your manual investments will appear here.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
