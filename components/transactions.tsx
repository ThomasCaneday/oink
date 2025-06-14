"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Calendar, Download, Menu, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainSidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Transactions() {
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
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-gray-500">View and manage your transaction history</p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Search Transactions</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="search" placeholder="Search..." className="pl-8" />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <label className="text-sm font-medium mb-2 block">Transaction Type</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="roundup">Round-ups</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-48">
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all">
            <TabsList className="mb-6 bg-pink-50">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All
              </TabsTrigger>
              <TabsTrigger value="roundups" className="data-[state=active]:bg-white">
                Round-ups
              </TabsTrigger>
              <TabsTrigger value="recurring" className="data-[state=active]:bg-white">
                Recurring
              </TabsTrigger>
              <TabsTrigger value="manual" className="data-[state=active]:bg-white">
                Manual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                    <CardDescription>Your complete transaction history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-500 font-medium">June 2023</div>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-pink-100 p-2">
                              <Plus className="h-4 w-4 text-pink-500" />
                            </div>
                            <div>
                              <div className="font-medium">Round-up Investment</div>
                              <div className="text-sm text-muted-foreground">June {10 - i}, 2023</div>
                            </div>
                          </div>
                          <div className="font-medium text-pink-600">+$3.{45 + i}</div>
                        </div>
                      ))}

                      <div className="text-sm text-gray-500 font-medium">May 2023</div>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-pink-100 p-2">
                              <Calendar className="h-4 w-4 text-pink-500" />
                            </div>
                            <div>
                              <div className="font-medium">Weekly Investment</div>
                              <div className="text-sm text-muted-foreground">May {25 - i * 7}, 2023</div>
                            </div>
                          </div>
                          <div className="font-medium text-pink-600">+$25.00</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="roundups">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Round-up Transactions</CardTitle>
                    <CardDescription>Your round-up investment history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-500 font-medium">June 2023</div>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-pink-100 p-2">
                              <Plus className="h-4 w-4 text-pink-500" />
                            </div>
                            <div>
                              <div className="font-medium">Round-up Investment</div>
                              <div className="text-sm text-muted-foreground">June {10 - i}, 2023</div>
                            </div>
                          </div>
                          <div className="font-medium text-pink-600">+$3.{45 + i}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="recurring">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Recurring Transactions</CardTitle>
                    <CardDescription>Your scheduled investment history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-500 font-medium">June 2023</div>
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-pink-100 p-2">
                              <Calendar className="h-4 w-4 text-pink-500" />
                            </div>
                            <div>
                              <div className="font-medium">Weekly Investment</div>
                              <div className="text-sm text-muted-foreground">June {8 - i * 7}, 2023</div>
                            </div>
                          </div>
                          <div className="font-medium text-pink-600">+$25.00</div>
                        </div>
                      ))}

                      <div className="text-sm text-gray-500 font-medium">May 2023</div>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-pink-100 p-2">
                              <Calendar className="h-4 w-4 text-pink-500" />
                            </div>
                            <div>
                              <div className="font-medium">Weekly Investment</div>
                              <div className="text-sm text-muted-foreground">May {25 - i * 7}, 2023</div>
                            </div>
                          </div>
                          <div className="font-medium text-pink-600">+$25.00</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="manual">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">No manual investments yet</h3>
                    <p className="text-sm text-muted-foreground">Your manual investments will appear here.</p>
                    <Button className="mt-4 bg-pink-500 hover:bg-pink-600" size="sm">
                      Make an Investment
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
