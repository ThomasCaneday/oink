"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, ChevronDown, Lock, Menu, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvestmentChart } from "@/components/investment-chart"
import { PortfolioBreakdown } from "@/components/portfolio-breakdown"
import { MainSidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { TopPerformers } from "@/components/top-performers"
import { ProjectedGrowth } from "@/components/projected-growth"

export function Portfolio() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M")
  const [isPremium, setIsPremium] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <MainSidebar isPremium={isPremium} />
          </SheetContent>
        </Sheet>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img src="/placeholder-user.jpg" alt="User avatar" width={32} height={32} className="rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsPremium(!isPremium)}>
                {isPremium ? "Cancel Premium" : "Upgrade to Premium"}
              </DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation (desktop only) */}
        <aside className="hidden md:block">
          <MainSidebar isPremium={isPremium} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Portfolio</h1>
            <p className="text-gray-500">Manage and track your investments</p>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mb-6 bg-pink-50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white">
                Analytics
                {!isPremium && <Lock className="ml-2 h-3 w-3" />}
              </TabsTrigger>
              <TabsTrigger value="coins" className="data-[state=active]:bg-white">
                Coins
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
              >
                {/* Current Holdings */}
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Current Holdings</CardTitle>
                    <CardDescription>Your cryptocurrency investments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-lg mr-3">
                            🟠
                          </div>
                          <div>
                            <div className="font-medium">Bitcoin</div>
                            <div className="text-sm text-gray-500">BTC</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$1,985.45</div>
                          <div className="text-sm text-green-500">+8.2%</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg mr-3">
                            🔷
                          </div>
                          <div>
                            <div className="font-medium">Ethereum</div>
                            <div className="text-sm text-gray-500">ETH</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$582.44</div>
                          <div className="text-sm text-green-500">+5.7%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-pink-200 text-pink-600 hover:bg-pink-50">
                      View All Coins
                    </Button>
                  </CardFooter>
                </Card>

                {/* Portfolio Value */}
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Portfolio Value</CardTitle>
                    <CardDescription>Total value of your investments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-pink-600 mb-2">$2,567.89</div>
                    <div className="flex items-center text-sm text-green-500 mb-4">
                      <span className="mr-1">↑</span> 12.5% from last month
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 mb-1">
                      <div className="h-2 rounded-full bg-pink-400" style={{ width: "77%" }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Initial Investment: $2,000</span>
                      <span>Profit: $567.89</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Portfolio Breakdown - Premium Feature */}
                <Card className="col-span-2 lg:col-span-4 relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Portfolio Breakdown</CardTitle>
                      {isPremium && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white">
                          <Sparkles className="h-3 w-3 mr-1" /> Premium
                        </Badge>
                      )}
                    </div>
                    <CardDescription>Your current asset allocation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isPremium ? (
                      <PortfolioBreakdown />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[250px] bg-gray-50 rounded-lg border border-dashed">
                        <Lock className="h-10 w-10 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">Premium Feature</h3>
                        <p className="text-sm text-gray-500 text-center max-w-xs mt-2 mb-4">
                          Upgrade to Premium to see your detailed portfolio breakdown and analytics.
                        </p>
                        <Button className="bg-pink-500 hover:bg-pink-600" onClick={() => setIsPremium(true)}>
                          Upgrade Now
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="analytics">
              {isPremium ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                >
                  {/* Investment Growth Chart */}
                  <Card className="col-span-2 lg:col-span-4">
                    <CardHeader className="flex flex-row items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle>Investment Growth</CardTitle>
                          <Badge className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white">
                            <Sparkles className="h-3 w-3 mr-1" /> Premium
                          </Badge>
                        </div>
                        <CardDescription>Your portfolio performance over time</CardDescription>
                      </div>
                      <div className="ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-pink-200 text-pink-600 hover:bg-pink-50"
                            >
                              {selectedTimeframe} <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedTimeframe("1W")}>1 Week</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedTimeframe("1M")}>1 Month</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedTimeframe("3M")}>3 Months</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedTimeframe("1Y")}>1 Year</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedTimeframe("ALL")}>All Time</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <InvestmentChart timeframe={selectedTimeframe} />
                    </CardContent>
                  </Card>

                  {/* Top Performers */}
                  <Card className="col-span-2">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle>Top Performers</CardTitle>
                        <Badge className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white">
                          <Sparkles className="h-3 w-3 mr-1" /> Premium
                        </Badge>
                      </div>
                      <CardDescription>Your best performing assets</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TopPerformers />
                    </CardContent>
                  </Card>

                  {/* Projected Growth */}
                  <Card className="col-span-2">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle>Projected Growth</CardTitle>
                        <Badge className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white">
                          <Sparkles className="h-3 w-3 mr-1" /> Premium
                        </Badge>
                      </div>
                      <CardDescription>Estimated future value</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProjectedGrowth />
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-lg border border-dashed">
                  <Lock className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700">Premium Analytics</h3>
                  <p className="text-sm text-gray-500 text-center max-w-md mt-2 mb-6">
                    Upgrade to Premium to access advanced analytics including investment growth charts, top performers,
                    and projected growth calculations.
                  </p>
                  <Button className="bg-pink-500 hover:bg-pink-600" onClick={() => setIsPremium(true)}>
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="coins">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Coins</CardTitle>
                    <CardDescription>Manage your cryptocurrency investments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl mr-4">
                            🟠
                          </div>
                          <div>
                            <div className="font-medium">Bitcoin</div>
                            <div className="text-sm text-gray-500">BTC</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$1,985.45</div>
                          <div className="text-sm text-green-500">+8.2%</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl mr-4">
                            🔷
                          </div>
                          <div>
                            <div className="font-medium">Ethereum</div>
                            <div className="text-sm text-gray-500">ETH</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$582.44</div>
                          <div className="text-sm text-green-500">+5.7%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-pink-500 hover:bg-pink-600">Add New Coin</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
