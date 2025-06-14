"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Bell, Menu, Plus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainSidebar } from "@/components/sidebar"
import { InvestmentChart } from "@/components/investment-chart"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { InvestmentHistory } from "@/components/investment-history"

interface Transaction {
  id: string
  date: string
  name: string
  amount: number
  roundup: number
}

export function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M")
  const [isPremium, setIsPremium] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInvesting, setIsInvesting] = useState(false)
  const [totalRoundups, setTotalRoundups] = useState(0)
  const [portfolioValue, setPortfolioValue] = useState(2567.89)
  const [selectedCoin, setSelectedCoin] = useState({ name: "Bitcoin", symbol: "BTC", logo: "🟠" })
  const [threshold, setThreshold] = useState(10)
  const [investmentSuccess, setInvestmentSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useMock, setUseMock] = useState(true)
  const [investAmount, setInvestAmount] = useState(10)
  const [orderType, setOrderType] = useState("market")
  const [limitPrice, setLimitPrice] = useState("")
  const [priceMultiplier, setPriceMultiplier] = useState("1.0")
  const [selectedCryptoCurrency, setSelectedCryptoCurrency] = useState("BTC")
  const [cryptoBalances, setCryptoBalances] = useState<Record<string, any>>({})
  const [isDepositAndBuying, setIsDepositAndBuying] = useState(false)
  const [depositAmount, setDepositAmount] = useState("10.00")
  const [timeframe, setTimeframe] = useState("1M")
  const [isMobile, setIsMobile] = useState(false)

  // For demo purposes, we'll use a fixed user ID
  const userId = "demo-user"

  // Ensure Coinbase is connected
  useEffect(() => {
    const connectCoinbase = async () => {
      try {
        console.log("Connecting Coinbase account...")
        const response = await fetch("/api/coinbase/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Failed to connect Coinbase: ${errorText}`)
          setError(`Failed to connect Coinbase: ${errorText}`)
          return
        }

        const data = await response.json()
        if (!data.success) {
          console.error("Failed to connect Coinbase:", data.error)
          setError(`Failed to connect Coinbase: ${data.error}`)
        } else {
          console.log("Coinbase connected successfully")
          setError(null)
        }
      } catch (error) {
        console.error("Error connecting to Coinbase:", error)
        setError(`Error connecting to Coinbase: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    connectCoinbase()
  }, [userId])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        console.log("Fetching transactions from Plaid...")

        const response = await fetch(`/api/plaid/transactions?userId=${userId}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Failed to fetch transactions: ${errorText}`)
          setError(`Failed to fetch transactions: ${errorText}`)
          return
        }

        const data = await response.json()

        if (data.error) {
          console.error("Error fetching transactions:", data.error)
          setError(`Error fetching transactions: ${data.error}`)
          return
        }

        console.log("Transactions fetched successfully:", data.transactions)
        setTransactions(data.transactions || [])
        setError(null)

        // Calculate total roundups
        const total = data.transactions.reduce((sum: number, tx: Transaction) => sum + tx.roundup, 0)
        setTotalRoundups(Number.parseFloat(total.toFixed(2)))
        console.log("Total roundups calculated:", total.toFixed(2))
      } catch (error) {
        console.error("Error fetching transactions:", error)
        setError(`Error fetching transactions: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [userId, investmentSuccess])

  // Fetch crypto balances
  useEffect(() => {
    const fetchCryptoBalances = async () => {
      try {
        if (useMock) {
          // Mock data for testing
          setCryptoBalances({
            BTC: { amount: 0.05, currency: "BTC", name: "Bitcoin", id: "mock-btc-id" },
            ETH: { amount: 1.2, currency: "ETH", name: "Ethereum", id: "mock-eth-id" },
            SOL: { amount: 10, currency: "SOL", name: "Solana", id: "mock-sol-id" },
          })
          return
        }

        const response = await fetch("/api/coinbase/balances", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
          console.error("Failed to fetch crypto balances")
          return
        }

        const data = await response.json()
        if (data.success) {
          setCryptoBalances(data.balances)
        }
      } catch (error) {
        console.error("Error fetching crypto balances:", error)
      }
    }

    fetchCryptoBalances()
  }, [useMock, investmentSuccess])

  // Update the checkAndAutoInvest function to handle invested transactions
  const checkAndAutoInvest = useCallback(async () => {
    if (totalRoundups < threshold) {
      console.log(`Total roundups (${totalRoundups.toFixed(2)}) below threshold (${threshold}), skipping auto-invest`)
      return
    }

    try {
      console.log("Starting auto-investment process...")
      setIsInvesting(true)
      setError(null)

      const response = await fetch("/api/coinbase/auto-invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          useMock,
        }),
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { error: response.statusText }
        }
        console.error(`Auto-invest request failed:`, errorData)
        setError(`Auto-invest request failed: ${JSON.stringify(errorData)}`)
        return
      }

      const data = await response.json()
      console.log("Auto-invest response:", data)

      if (data.success) {
        // Update portfolio value
        setPortfolioValue((prev) => Number.parseFloat((prev + totalRoundups).toFixed(2)))
        // Reset roundups
        setTotalRoundups(0)
        setInvestmentSuccess(!investmentSuccess) // Toggle to trigger transaction refresh

        // Show success message (in a real app, you might use a toast notification)
        alert(`Successfully invested ${totalRoundups.toFixed(2)} in ${selectedCoin.name}!`)

        // Add the investment to the transaction history
        const newInvestment = {
          id: `invest-${Date.now()}`,
          date: new Date().toISOString(),
          name: `Auto-Investment in ${selectedCoin.name}`,
          amount: totalRoundups,
          type: "investment",
        }

        // In a real app, you would store this in a database
        console.log("New investment recorded:", newInvestment)
      } else if (data.message && data.message.includes("does not meet the threshold")) {
        // This is expected when threshold isn't met
        console.log(data.message)
      } else {
        console.error("Failed to auto-invest:", data.error, data.details)
        setError(`Failed to auto-invest: ${data.error}${data.details ? ` - ${data.details}` : ""}`)
        alert(`Investment failed: ${data.error}${data.details ? ` - ${data.details}` : ""}`)
      }
    } catch (error) {
      console.error("Error in auto-invest:", error)
      setError(`Error in auto-invest: ${error instanceof Error ? error.message : String(error)}`)
      alert("An error occurred while trying to auto-invest. Please try again later.")
    } finally {
      setIsInvesting(false)
    }
  }, [totalRoundups, threshold, userId, selectedCoin.name, investmentSuccess, useMock])

  // Add this useEffect to check for auto-invest when transactions or threshold changes
  // Update the useEffect that checks for auto-invest to use the new tracking of invested transactions
  useEffect(() => {
    const fetchAndCalculateRoundups = async () => {
      if (transactions.length === 0) return

      try {
        // Get user data to check for already invested transactions
        const response = await fetch(`/api/user-data?userId=${userId}`)
        const userData = await response.json()

        if (!response.ok) {
          console.error("Failed to fetch user data:", userData.error)
          return
        }

        // Filter out already invested transactions
        const investedTransactionIds = userData.data.investedTransactions || []
        const uninvestedTransactions = transactions.filter((tx) => !investedTransactionIds.includes(tx.id))

        // Calculate total roundups from uninvested transactions
        const uninvestedRoundups = uninvestedTransactions.reduce((sum, tx) => sum + tx.roundup, 0)
        setTotalRoundups(Number.parseFloat(uninvestedRoundups.toFixed(2)))

        // Check if threshold is met
        if (uninvestedRoundups >= threshold) {
          console.log("Threshold reached with uninvested transactions, attempting auto-invest...")
          checkAndAutoInvest()
        }
      } catch (error) {
        console.error("Error calculating uninvested roundups:", error)
      }
    }

    fetchAndCalculateRoundups()
  }, [transactions, threshold, userId, checkAndAutoInvest])

  // Manual trigger for auto-invest (for testing)
  const handleManualInvest = () => {
    if (totalRoundups < threshold) {
      alert(`You need at least ${threshold} in roundups to invest. Current total: ${totalRoundups.toFixed(2)}`)
      return
    }
    checkAndAutoInvest()
  }

  // Test Coinbase integration
  const testCoinbase = async (action: string) => {
    try {
      setError(null)
      const testAmount = 10.0
      const testCurrency = "BTC"

      const response = await fetch("/api/coinbase/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          amount: testAmount,
          currency: testCurrency,
          useMock,
        }),
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { error: response.statusText }
        }
        setError(`Coinbase test failed: ${JSON.stringify(errorData)}`)
        return
      }

      const data = await response.json()
      console.log(`Coinbase ${action} test result:`, data)
      alert(`Coinbase ${action} test successful!`)
    } catch (error) {
      console.error(`Error in Coinbase ${action} test:`, error)
      setError(`Error in Coinbase ${action} test: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // Test direct invest endpoint
  const testDirectInvest = async () => {
    try {
      setError(null)
      setIsInvesting(true)

      // Prepare request body based on order type
      const requestBody: any = {
        amount: investAmount,
        currency: selectedCryptoCurrency,
        useMock,
        orderType,
      }

      // Add additional parameters for limit orders
      if (orderType === "limit") {
        if (limitPrice) {
          requestBody.limitPrice = limitPrice
        } else if (priceMultiplier) {
          requestBody.priceMultiplier = priceMultiplier
        }
      }

      const response = await fetch("/api/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { error: response.statusText }
        }
        setError(`Direct invest failed: ${JSON.stringify(errorData)}`)
        return
      }

      const data = await response.json()
      console.log("Direct invest result:", data)
      alert(`Direct invest of ${investAmount} in ${selectedCryptoCurrency} successful!`)

      // Update portfolio value
      setPortfolioValue((prev) => Number.parseFloat((prev + investAmount).toFixed(2)))
      setInvestmentSuccess(!investmentSuccess) // Toggle to trigger refreshes
    } catch (error) {
      console.error("Error in direct invest:", error)
      setError(`Error in direct invest: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsInvesting(false)
    }
  }

  // Handle deposit and buy operation
  const handleDepositAndBuy = async () => {
    try {
      setError(null)
      setIsDepositAndBuying(true)

      const response = await fetch("/api/coinbase/deposit-and-buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threshold: depositAmount,
          crypto_symbol: selectedCryptoCurrency,
          useMock,
        }),
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { error: response.statusText }
        }
        setError(`Deposit and buy failed: ${JSON.stringify(errorData)}`)
        return
      }

      const data = await response.json()
      console.log("Deposit and buy result:", data)
      alert(`Successfully deposited $${depositAmount} and bought ${selectedCryptoCurrency}!`)

      // Update portfolio value
      setPortfolioValue((prev) => Number.parseFloat((prev + Number.parseFloat(depositAmount)).toFixed(2)))
      setInvestmentSuccess(!investmentSuccess) // Toggle to trigger refreshes
    } catch (error) {
      console.error("Error in deposit and buy:", error)
      setError(`Error in deposit and buy: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsDepositAndBuying(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
        <div className="flex items-center">
          <div className="mr-2">
            <svg viewBox="0 0 100 100" className="h-8 w-8">
              <path d="M30,50 C30,65 45,80 65,75 C85,70 85,40 75,30 C65,20 45,20 30,50 Z" fill="#FF6B9D" />
              <circle cx="45" cy="40" r="3" fill="#FFF" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-pink-600">Oink!</h1>
        </div>

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
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Your investment overview</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            {/* Total Savings Card - Moved to top */}
            <Card className="col-span-2 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-pink-50 to-white">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                  <CardDescription>Your investment portfolio value</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-pink-600">${portfolioValue.toFixed(2)}</div>
                <div className="flex items-center text-sm text-green-500">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  12.5% from last month
                </div>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <div className="col-span-2 rounded-md bg-pink-50 p-2 text-sm text-pink-700 border border-pink-200">
                    {isInvesting ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-pink-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Auto-investing...
                      </div>
                    ) : totalRoundups >= threshold ? (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">✨</span>
                        Ready to invest! ${totalRoundups.toFixed(2)} will be invested automatically
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">💰</span>${totalRoundups.toFixed(2)} of ${threshold} threshold for
                        auto-investment
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="border-pink-200 text-pink-600 hover:bg-pink-50"
                    onClick={handleManualInvest}
                    disabled={totalRoundups < threshold || isInvesting}
                  >
                    {isInvesting ? "Investing..." : "Invest Now"}
                  </Button>
                  <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                    Change Coin
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Growth Chart - Moved to top */}
            <div className="col-span-2 lg:col-span-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-normal">Investment Growth</CardTitle>
                  <div className="flex space-x-2">
                    {["1W", "1M", "3M", "1Y", "ALL"].map((option) => (
                      <Button
                        key={option}
                        variant={timeframe === option ? "default" : "outline"}
                        className={`h-8 px-2 text-xs ${isMobile ? "px-1" : "px-2"}`}
                        onClick={() => setTimeframe(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="px-0 sm:px-2 md:px-6">
                  <InvestmentChart timeframe={timeframe} />
                </CardContent>
              </Card>
            </div>

            {/* Round-ups Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Round-ups</CardTitle>
                <CardDescription>Auto-invest at ${threshold}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRoundups.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">From {transactions.length} transactions</div>
                <div className="mt-4 h-2 rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-pink-400"
                    style={{ width: `${Math.min((totalRoundups / threshold) * 100, 100)}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    ${totalRoundups.toFixed(2)} of ${threshold}
                  </div>
                  {totalRoundups >= threshold && (
                    <div className="text-xs text-green-600 font-medium">Ready to invest!</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Coin Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current Coin</CardTitle>
                <CardDescription>Your investment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-lg">
                    {selectedCoin.logo}
                  </div>
                  <div>
                    <div className="font-medium">{selectedCoin.name}</div>
                    <div className="text-xs text-gray-500">{selectedCoin.symbol}</div>
                  </div>
                </div>
                <div className="text-sm text-green-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  8.2% this week
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full text-pink-600 hover:bg-pink-50 hover:text-pink-700"
                >
                  Change coin
                </Button>
              </CardContent>
            </Card>

            {/* Crypto Balances Card */}
            <Card className="col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Crypto Balances</CardTitle>
                <CardDescription>Your current cryptocurrency holdings</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(cryptoBalances).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(cryptoBalances).map(([currency, data]: [string, any]) => (
                      <div key={currency} className="flex justify-between items-center p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {currency === "BTC" ? "🟠" : currency === "ETH" ? "🔷" : "💰"}
                          </div>
                          <div>
                            <div className="font-medium">{data.name || currency}</div>
                            <div className="text-xs text-gray-500">{currency}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{data.amount.toFixed(8)}</div>
                          <div className="text-xs text-gray-500">
                            ≈ $
                            {(data.amount * (currency === "BTC" ? 50000 : currency === "ETH" ? 3000 : 100)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">No crypto balances found</div>
                )}
              </CardContent>
            </Card>

            {/* Investment History */}
            <Card className="col-span-2 lg:col-span-4 mb-4">
              <InvestmentHistory userId={userId} />
            </Card>

            {/* Recent Transactions */}
            <Card className="col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest investment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4 bg-pink-50">
                    <TabsTrigger value="all" className="data-[state=active]:bg-white">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="roundups" className="data-[state=active]:bg-white">
                      Round-ups
                    </TabsTrigger>
                    <TabsTrigger value="referrals" className="data-[state=active]:bg-white">
                      Referrals
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="data-[state=active]:bg-white">
                      Manual
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="space-y-4">
                    <div className="grid gap-4">
                      {isLoading ? (
                        <div className="text-center py-4">Loading transactions...</div>
                      ) : transactions.length > 0 ? (
                        transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="rounded-full bg-pink-100 p-2">
                                <Plus className="h-4 w-4 text-pink-500" />
                              </div>
                              <div>
                                <div className="font-medium">{tx.name}</div>
                                <div className="text-sm text-muted-foreground">{tx.date}</div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="font-medium">${tx.amount.toFixed(2)}</div>
                              <div className="text-sm text-pink-600">+${tx.roundup.toFixed(2)} roundup</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">No transactions found</div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="roundups" className="space-y-4">
                    <div className="grid gap-4">
                      {isLoading ? (
                        <div className="text-center py-4">Loading transactions...</div>
                      ) : transactions.length > 0 ? (
                        transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="rounded-full bg-pink-100 p-2">
                                <Plus className="h-4 w-4 text-pink-500" />
                              </div>
                              <div>
                                <div className="font-medium">{tx.name} Roundup</div>
                                <div className="text-sm text-muted-foreground">{tx.date}</div>
                              </div>
                            </div>
                            <div className="font-medium text-pink-600">+${tx.roundup.toFixed(2)}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">No roundups found</div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="referrals">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-green-100 p-2">
                            <Users className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium">Referral Bonus - Sarah Johnson</div>
                            <div className="text-sm text-muted-foreground">May 12, 2023</div>
                          </div>
                        </div>
                        <div className="font-medium text-green-600">+$10.00</div>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-green-100 p-2">
                            <Users className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium">Referral Bonus - Mike Smith</div>
                            <div className="text-sm text-muted-foreground">June 3, 2023</div>
                          </div>
                        </div>
                        <div className="font-medium text-green-600">+$10.00</div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="manual">
                    <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <h3 className="text-lg font-medium">No manual investments yet</h3>
                        <p className="text-sm text-muted-foreground">Your manual investments will appear here.</p>
                        <Button className="mt-4 bg-pink-500 hover:bg-pink-600" size="sm">
                          Make an Investment
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-pink-200 text-pink-600 hover:bg-pink-50">
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>

            {/* New Deposit and Buy Card */}
            <Card className="col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Deposit and Buy</CardTitle>
                <CardDescription>Deposit funds and buy cryptocurrency in one step</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="depositAmount">Deposit Amount ($)</Label>
                      <Input
                        id="depositAmount"
                        type="number"
                        min="1"
                        step="0.01"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cryptoCurrency">Cryptocurrency</Label>
                      <Select value={selectedCryptoCurrency} onValueChange={setSelectedCryptoCurrency}>
                        <SelectTrigger id="cryptoCurrency">
                          <SelectValue placeholder="Select cryptocurrency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                          <SelectItem value="SOL">Solana (SOL)</SelectItem>
                          <SelectItem value="DOGE">Dogecoin (DOGE)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="rounded-md bg-pink-50 p-3 text-sm text-pink-700 border border-pink-200 mb-4">
                      <p>
                        This will deposit ${depositAmount} into your Coinbase account and immediately use it to buy{" "}
                        {selectedCryptoCurrency}.
                      </p>
                    </div>
                    <Button
                      className="w-full bg-pink-500 hover:bg-pink-600"
                      onClick={handleDepositAndBuy}
                      disabled={isDepositAndBuying}
                    >
                      {isDepositAndBuying
                        ? "Processing..."
                        : `Deposit ${depositAmount} and Buy ${selectedCryptoCurrency}`}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* New Advanced Trading Card */}
            <Card className="col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Advanced Trading</CardTitle>
                <CardDescription>Test the Coinbase Advanced Trading API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cryptoCurrency">Cryptocurrency</Label>
                      <Select value={selectedCryptoCurrency} onValueChange={setSelectedCryptoCurrency}>
                        <SelectTrigger id="cryptoCurrency">
                          <SelectValue placeholder="Select cryptocurrency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                          <SelectItem value="SOL">Solana (SOL)</SelectItem>
                          <SelectItem value="DOGE">Dogecoin (DOGE)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="investAmount">Amount to Invest ($)</Label>
                      <Input
                        id="investAmount"
                        type="number"
                        min="1"
                        step="0.01"
                        value={investAmount}
                        onChange={(e) => setInvestAmount(Number(e.target.value))}
                      />
                    </div>

                    <div>
                      <Label>Order Type</Label>
                      <RadioGroup value={orderType} onValueChange={setOrderType} className="mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="market" id="market" />
                          <Label htmlFor="market">Market Order</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="limit" id="limit" />
                          <Label htmlFor="limit">Limit Order</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {orderType === "limit" && (
                      <>
                        <div>
                          <Label htmlFor="limitPrice">Limit Price (optional)</Label>
                          <Input
                            id="limitPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={limitPrice}
                            onChange={(e) => setLimitPrice(e.target.value)}
                            placeholder="Leave empty to use current price"
                          />
                        </div>

                        <div>
                          <Label htmlFor="priceMultiplier">Price Multiplier</Label>
                          <Select value={priceMultiplier} onValueChange={setPriceMultiplier}>
                            <SelectTrigger id="priceMultiplier">
                              <SelectValue placeholder="Select multiplier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0.9">10% below market (0.9x)</SelectItem>
                              <SelectItem value="0.95">5% below market (0.95x)</SelectItem>
                              <SelectItem value="1.0">At market price (1.0x)</SelectItem>
                              <SelectItem value="1.05">5% above market (1.05x)</SelectItem>
                              <SelectItem value="1.1">10% above market (1.1x)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">Only used if no limit price is specified</p>
                        </div>
                      </>
                    )}

                    <Button
                      className="w-full mt-6 bg-pink-500 hover:bg-pink-600"
                      onClick={testDirectInvest}
                      disabled={isInvesting}
                    >
                      {isInvesting
                        ? "Processing..."
                        : `${orderType === "market" ? "Market" : "Limit"} ${investAmount > 0 ? "Buy" : "Sell"} ${selectedCryptoCurrency}`}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coinbase Test Buttons - Moved to bottom */}
            <Card className="col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Coinbase API Testing</CardTitle>
                <CardDescription>Test various Coinbase API endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => testCoinbase("deposit")}>
                    Test Deposit
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => testCoinbase("buy")}>
                    Test Buy
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => testCoinbase("balance")}>
                    Test Balance
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => testCoinbase("deposit-and-buy")}
                  >
                    Test Deposit & Buy
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => testCoinbase("account-info")}>
                    Test Account Info
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Development Mode UI - Moved to bottom */}
            <Card className="col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Development Settings</CardTitle>
                <CardDescription>Configure development and testing options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-yellow-800">Development Mode</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-yellow-700">Use Mock API</span>
                    <Switch checked={useMock} onCheckedChange={setUseMock} />
                  </div>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  {useMock
                    ? "Using mock Coinbase API for testing. No real transactions will be made."
                    : "Using real Coinbase API. Real transactions will be made."}
                </p>
              </CardContent>
            </Card>

            {/* Error UI - Moved to bottom */}
            {error && (
              <Card className="col-span-2 lg:col-span-4">
                <CardHeader>
                  <CardTitle className="text-red-600">Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600 mb-4">{error}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setError(null)}>
                      Dismiss
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => testCoinbase("balance")}>
                      Test Coinbase Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
