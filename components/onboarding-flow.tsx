"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight, CreditCard, PiggyBank, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PlaidLinkButton } from "@/components/plaid-link-button"
import { saveUserPreferences } from "@/actions/user-actions"

// Mock cryptocurrency data
const cryptocurrencies = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", logo: "🟠" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", logo: "🔷" },
  { id: "solana", name: "Solana", symbol: "SOL", logo: "🟣" },
  { id: "cardano", name: "Cardano", symbol: "ADA", logo: "🔵" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", logo: "⚫" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", logo: "🟡" },
  { id: "ripple", name: "Ripple", symbol: "XRP", logo: "⚪" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK", logo: "🔗" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC", logo: "⚪" },
  { id: "uniswap", name: "Uniswap", symbol: "UNI", logo: "🦄" },
]

export function OnboardingFlow() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [plaidConnected, setPlaidConnected] = useState(false)
  const [roundupFrequency, setRoundupFrequency] = useState("every")
  const [threshold, setThreshold] = useState(10)
  const [coinSearch, setCoinSearch] = useState("")
  const [selectedCoin, setSelectedCoin] = useState<any>(null)
  const [openCoinSelector, setOpenCoinSelector] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // For demo purposes, we'll use a fixed user ID
  const userId = "demo-user"

  const filteredCoins = cryptocurrencies.filter(
    (coin) =>
      coin.name.toLowerCase().includes(coinSearch.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(coinSearch.toLowerCase()),
  )

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      router.push("/dashboard")
    }
  }

  const handlePlaidSuccess = () => {
    setPlaidConnected(true)
  }

  const handleSubmitPreferences = async () => {
    if (!selectedCoin) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("roundupFrequency", roundupFrequency)
      formData.append("threshold", threshold.toString())
      formData.append("selectedCoin", selectedCoin.id)

      const result = await saveUserPreferences(userId, formData)

      // Explicitly connect Coinbase account
      const coinbaseResult = await fetch("/api/coinbase/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const coinbaseData = await coinbaseResult.json()

      if (result.success && coinbaseData.success) {
        router.push("/dashboard")
      } else {
        console.error("Failed to save preferences or connect Coinbase:", result.error || coinbaseData.error)
        alert(`Failed to complete setup: ${result.error || coinbaseData.error}`)
      }
    } catch (error) {
      console.error("Error saving preferences:", error)
      alert("An error occurred while saving your preferences. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Disable next button conditions
  const isNextDisabled = () => {
    if (step === 1) return !plaidConnected
    if (step === 2) return !selectedCoin
    return false
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-white p-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center">
            <PiggyBank className="h-8 w-8 text-pink-500 mr-2" />
            <h1 className="text-2xl font-bold text-pink-600">Oink</h1>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  i <= step ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < step ? <Check className="h-5 w-5" /> : i}
              </div>
            ))}
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div
              className="absolute h-2 bg-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 1) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Connect Your Bank</CardTitle>
                  <CardDescription className="text-center">
                    Connect your bank account to start investing your spare change
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border p-6 text-center">
                    <CreditCard className="mx-auto h-12 w-12 text-pink-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Bank Connection Required</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      We use Plaid to securely connect to your bank. Your credentials are never stored on our servers.
                    </p>

                    {!plaidConnected ? (
                      <PlaidLinkButton userId={userId} onSuccess={handlePlaidSuccess} isLoading={isLoading} />
                    ) : (
                      <div className="flex items-center justify-center text-green-500 font-medium">
                        <Check className="mr-2 h-5 w-5" />
                        Bank Connected Successfully
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={nextStep}
                    className="w-full bg-pink-500 hover:bg-pink-600"
                    disabled={!plaidConnected}
                  >
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Investment Preferences</CardTitle>
                  <CardDescription className="text-center">Customize your round-up investment settings</CardDescription>
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
                      <Label className="text-lg font-medium">Auto-Investment Threshold</Label>
                      <span className="text-pink-600 font-medium">${threshold}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Round-ups will automatically be invested when they reach this amount
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
                    <div className="rounded-md bg-pink-50 p-3 text-sm text-pink-700 border border-pink-200">
                      <div className="flex items-center">
                        <span className="mr-2">✨</span>
                        <span>
                          Oink will automatically invest your round-ups when they reach the threshold - no manual action
                          required!
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="coin" className="text-lg font-medium">
                      Select Cryptocurrency
                    </Label>
                    <Popover open={openCoinSelector} onOpenChange={setOpenCoinSelector}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCoinSelector}
                          className="w-full justify-between"
                        >
                          {selectedCoin ? (
                            <div className="flex items-center">
                              <span className="mr-2">{selectedCoin.logo}</span>
                              <span>
                                {selectedCoin.name} ({selectedCoin.symbol})
                              </span>
                            </div>
                          ) : (
                            "Search for a cryptocurrency..."
                          )}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search cryptocurrency..."
                            value={coinSearch}
                            onValueChange={setCoinSearch}
                          />
                          <CommandList>
                            <CommandEmpty>No cryptocurrency found. Please try another search term.</CommandEmpty>
                            <CommandGroup>
                              {filteredCoins.map((coin) => (
                                <CommandItem
                                  key={coin.id}
                                  onSelect={() => {
                                    setSelectedCoin(coin)
                                    setOpenCoinSelector(false)
                                  }}
                                >
                                  <div className="flex items-center">
                                    <span className="mr-2">{coin.logo}</span>
                                    <span>{coin.name}</span>
                                    <span className="ml-2 text-gray-500">({coin.symbol})</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {selectedCoin && (
                      <div className="mt-4 rounded-lg border p-4 bg-pink-50">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">{selectedCoin.logo}</span>
                          <div>
                            <h4 className="font-medium">{selectedCoin.name}</h4>
                            <p className="text-sm text-gray-500">{selectedCoin.symbol}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Your spare change will be invested in {selectedCoin.name}. You can change this selection later
                          in your account settings.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSubmitPreferences}
                    className="w-full bg-pink-500 hover:bg-pink-600"
                    disabled={!selectedCoin || isLoading}
                  >
                    {isLoading ? "Saving..." : "Complete Setup"}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
