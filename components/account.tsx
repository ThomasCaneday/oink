"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, CreditCard, Key, Menu, PiggyBank, Shield, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainSidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

export function Account() {
  const [isPremium, setIsPremium] = useState(false)
  const [roundupFrequency, setRoundupFrequency] = useState("every")
  const [threshold, setThreshold] = useState(15)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

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
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <p className="text-gray-500">Manage your account preferences</p>
          </div>

          <Tabs defaultValue="profile">
            <TabsList className="mb-6 bg-pink-50">
              <TabsTrigger value="profile" className="data-[state=active]:bg-white">
                Profile
              </TabsTrigger>
              <TabsTrigger value="bank" className="data-[state=active]:bg-white">
                Bank Accounts
              </TabsTrigger>
              <TabsTrigger value="investment" className="data-[state=active]:bg-white">
                Investment Preferences
              </TabsTrigger>
              <TabsTrigger value="subscription" className="data-[state=active]:bg-white">
                Subscription
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-white">
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" defaultValue="John Doe" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input id="dateOfBirth" type="date" defaultValue="1990-01-01" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-pink-500 hover:bg-pink-600">Save Changes</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="bank">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Bank Accounts</CardTitle>
                    <CardDescription>Manage your linked bank accounts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CreditCard className="h-8 w-8 text-pink-500" />
                        <div>
                          <div className="font-medium">Chase Bank</div>
                          <div className="text-sm text-gray-500">Connected on May 15, 2023</div>
                        </div>
                      </div>
                      <Button variant="outline" className="text-pink-600 border-pink-200 hover:bg-pink-50">
                        Disconnect
                      </Button>
                    </div>

                    <div className="mt-6">
                      <Button className="bg-pink-500 hover:bg-pink-600">
                        <PiggyBank className="mr-2 h-4 w-4" />
                        Connect Another Bank
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        We use Plaid to securely connect to your bank. Your credentials are never stored on our servers.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="investment">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Preferences</CardTitle>
                    <CardDescription>Customize your round-up investment settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-lg font-medium">Round-up Frequency</Label>
                      <RadioGroup value={roundupFrequency} onValueChange={setRoundupFrequency}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="every" id="every" />
                          <Label htmlFor="every" className="cursor-pointer">
                            Every transaction
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="everyOther" id="everyOther" />
                          <Label htmlFor="everyOther" className="cursor-pointer">
                            Every other transaction
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-lg font-medium">Investment Threshold</Label>
                        <span className="text-pink-600 font-medium">${threshold}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Round-ups will accumulate until they reach this amount before investing
                      </p>
                      <Slider
                        value={[threshold]}
                        min={10}
                        max={20}
                        step={1}
                        onValueChange={(value) => setThreshold(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>$10</span>
                        <span>$20</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-lg font-medium">Investment Coin</Label>
                      <div className="flex items-center gap-4 p-4 rounded-lg border">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                          🟠
                        </div>
                        <div>
                          <div className="font-medium">Bitcoin</div>
                          <div className="text-sm text-gray-500">BTC</div>
                        </div>
                      </div>
                      <Button variant="outline" className="text-pink-600 border-pink-200 hover:bg-pink-50">
                        Change Investment Coin
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-pink-500 hover:bg-pink-600">Save Preferences</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="subscription">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Management</CardTitle>
                    <CardDescription>Manage your Oink subscription</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border p-6">
                      <h3 className="text-lg font-medium mb-2">Current Plan: {isPremium ? "Premium" : "Free"}</h3>

                      {isPremium ? (
                        <>
                          <p className="text-sm text-gray-500 mb-4">
                            You are currently on the Premium plan. You have access to all features including advanced
                            analytics, portfolio breakdown, and projected growth calculations.
                          </p>
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                            <div>
                              <div className="font-medium">Next billing date</div>
                              <div className="text-sm text-gray-500">July 15, 2023</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">$9.99/month</div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full text-pink-600 border-pink-200 hover:bg-pink-50"
                            onClick={() => setIsPremium(false)}
                          >
                            Cancel Subscription
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500 mb-4">
                            You are currently on the Free plan. Upgrade to Premium to access advanced analytics,
                            portfolio breakdown, and projected growth calculations.
                          </p>
                          <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="flex-1 rounded-lg border p-4">
                              <div className="font-medium mb-2">Monthly</div>
                              <div className="text-2xl font-bold mb-1">
                                $9.99<span className="text-sm font-normal text-gray-500">/month</span>
                              </div>
                              <p className="text-sm text-gray-500 mb-4">Billed monthly</p>
                              <Button
                                className="w-full bg-pink-500 hover:bg-pink-600"
                                onClick={() => setIsPremium(true)}
                              >
                                Choose Plan
                              </Button>
                            </div>
                            <div className="flex-1 rounded-lg border p-4 border-pink-200 bg-pink-50">
                              <div className="font-medium mb-2">
                                Annual{" "}
                                <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full ml-2">
                                  Save 20%
                                </span>
                              </div>
                              <div className="text-2xl font-bold mb-1">
                                $7.99<span className="text-sm font-normal text-gray-500">/month</span>
                              </div>
                              <p className="text-sm text-gray-500 mb-4">$95.88 billed annually</p>
                              <Button
                                className="w-full bg-pink-500 hover:bg-pink-600"
                                onClick={() => setIsPremium(true)}
                              >
                                Choose Plan
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="security">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                      <Button className="bg-pink-500 hover:bg-pink-600">
                        <Key className="mr-2 h-4 w-4" />
                        Update Password
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                      </div>

                      {twoFactorEnabled && (
                        <div className="mt-4 p-4 rounded-lg bg-pink-50 border border-pink-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-5 w-5 text-pink-500" />
                            <span className="font-medium">Two-Factor Authentication is enabled</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Your account is now more secure. You will need to enter a verification code when logging in.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Login Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-green-100 p-1.5">
                              <User className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium">Current Session</div>
                              <div className="text-xs text-gray-500">Chrome on macOS • New York, USA</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">Active now</div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-gray-100 p-1.5">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium">Mobile App</div>
                              <div className="text-xs text-gray-500">iPhone • New York, USA</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">2 hours ago</div>
                        </div>
                      </div>

                      <Button variant="outline" className="mt-4 text-pink-600 border-pink-200 hover:bg-pink-50">
                        Log Out All Other Sessions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
