"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Menu, Share, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MainSidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Community() {
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
            <h1 className="text-2xl font-bold">Community</h1>
            <p className="text-gray-500">Invite friends and earn rewards</p>
          </div>

          <Tabs defaultValue="referrals">
            <TabsList className="mb-6 bg-pink-50">
              <TabsTrigger value="referrals" className="data-[state=active]:bg-white">
                Referrals
              </TabsTrigger>
              <TabsTrigger value="friends" className="data-[state=active]:bg-white">
                Friends
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-white">
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="referrals">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid gap-4 md:grid-cols-2"
              >
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Referral Program</CardTitle>
                    <CardDescription>Invite friends and earn rewards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4 bg-pink-50">
                      <h3 className="font-medium mb-2">How it works</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Share your unique referral link with friends. When they sign up and make their first investment,
                        you'll both receive $10 in your Oink accounts.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input value="https://oink.com/ref/johndoe123" readOnly className="bg-white" />
                        <Button className="bg-pink-500 hover:bg-pink-600 whitespace-nowrap">
                          <Share className="mr-2 h-4 w-4" />
                          Share Link
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Your Referral Stats</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-lg border p-4 text-center">
                          <div className="text-2xl font-bold text-pink-600">2</div>
                          <div className="text-sm text-gray-500">Friends Referred</div>
                        </div>
                        <div className="rounded-lg border p-4 text-center">
                          <div className="text-2xl font-bold text-pink-600">$20.00</div>
                          <div className="text-sm text-gray-500">Total Earned</div>
                        </div>
                        <div className="rounded-lg border p-4 text-center">
                          <div className="text-2xl font-bold text-pink-600">$10.00</div>
                          <div className="text-sm text-gray-500">Pending Rewards</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Your Referrals</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder-user.jpg" alt="Sarah Johnson" />
                              <AvatarFallback>SJ</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Sarah Johnson</div>
                              <div className="text-xs text-gray-500">Joined May 12, 2023</div>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-green-500">+$10.00</div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder-user.jpg" alt="Mike Smith" />
                              <AvatarFallback>MS</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Mike Smith</div>
                              <div className="text-xs text-gray-500">Joined June 3, 2023</div>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-green-500">+$10.00</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                      <Users className="mr-2 h-4 w-4" />
                      Invite More Friends
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="friends">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Friends</CardTitle>
                    <CardDescription>See how your friends are doing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder-user.jpg" alt="Sarah Johnson" />
                            <AvatarFallback>SJ</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Sarah Johnson</div>
                            <div className="text-sm text-gray-500">Investing in Bitcoin</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$1,245.67</div>
                          <div className="text-sm text-green-500">+12.3%</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder-user.jpg" alt="Mike Smith" />
                            <AvatarFallback>MS</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Mike Smith</div>
                            <div className="text-sm text-gray-500">Investing in Ethereum</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$876.54</div>
                          <div className="text-sm text-green-500">+8.7%</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder-user.jpg" alt="Alex Wong" />
                            <AvatarFallback>AW</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Alex Wong</div>
                            <div className="text-sm text-gray-500">Investing in Solana</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$543.21</div>
                          <div className="text-sm text-red-500">-2.1%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-pink-200 text-pink-600 hover:bg-pink-50">
                      Find More Friends
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="leaderboard">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Leaderboard</CardTitle>
                    <CardDescription>See who's earning the most</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border bg-pink-50">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-white font-bold">
                            1
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder-user.jpg" alt="Jessica Lee" />
                            <AvatarFallback>JL</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Jessica Lee</div>
                            <div className="text-sm text-gray-500">12 referrals</div>
                          </div>
                        </div>
                        <div className="text-right font-medium">$120.00</div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-white font-bold">
                            2
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder-user.jpg" alt="David Chen" />
                            <AvatarFallback>DC</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">David Chen</div>
                            <div className="text-sm text-gray-500">8 referrals</div>
                          </div>
                        </div>
                        <div className="text-right font-medium">$80.00</div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-white font-bold">
                            3
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder-user.jpg" alt="Maria Garcia" />
                            <AvatarFallback>MG</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Maria Garcia</div>
                            <div className="text-sm text-gray-500">6 referrals</div>
                          </div>
                        </div>
                        <div className="text-right font-medium">$60.00</div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 font-bold">
                            8
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder-user.jpg" alt="You" />
                            <AvatarFallback>You</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">You</div>
                            <div className="text-sm text-gray-500">2 referrals</div>
                          </div>
                        </div>
                        <div className="text-right font-medium">$20.00</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <p className="text-sm text-gray-500 text-center">
                      Invite more friends to climb the leaderboard and earn more rewards!
                    </p>
                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                      <Share className="mr-2 h-4 w-4" />
                      Share Your Referral Link
                    </Button>
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
