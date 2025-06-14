import { NextResponse } from "next/server"
import { depositFiat, fiatMarketBuy, validateCoinbaseEnv, mockDepositAndBuy } from "@/lib/coinbase-server"

export async function POST(request: Request) {
  try {
    // Validate Coinbase environment variables
    validateCoinbaseEnv()

    // Get request body
    const {
      amount = 10,
      currency = "BTC",
      useMock = false,
      orderType = "market",
    } = await request.json().catch(() => ({}))

    console.log(`Processing investment of $${amount} in ${currency}${useMock ? " (mock)" : ""}`)

    // If using mock, return mock data
    if (useMock) {
      console.log("Using mock implementation for investment")
      const mockResult = await mockDepositAndBuy(amount, currency)
      return NextResponse.json({
        success: true,
        result: mockResult,
      })
    }

    let result

    if (orderType === "market") {
      // First deposit the fiat currency
      const depositResult = await depositFiat(amount)
      console.log("Deposit completed successfully:", depositResult)

      // Wait for deposit to be processed (in a real app, you would poll for status)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Then buy the cryptocurrency using market order
      const productId = `${currency}-USD`
      const buyResult = await fiatMarketBuy(productId, amount.toString())
      console.log("Buy completed successfully:", buyResult)

      result = {
        deposit: depositResult,
        buy: buyResult,
      }
    } else {
      // Use the depositAndBuy function for other order types
      result = await mockDepositAndBuy(amount, currency)
    }

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error: any) {
    console.error("Error in investment:", error)
    return NextResponse.json(
      {
        error: "Failed to process investment",
        details: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
