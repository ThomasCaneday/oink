import { NextResponse } from "next/server"
import { buyCryptocurrency, validateCoinbaseEnv, mockBuyCryptocurrency } from "@/lib/coinbase-server"

export async function POST(request: Request) {
  try {
    // Validate Coinbase environment variables
    validateCoinbaseEnv()

    const { amount, currency = "BTC", useMock = false } = await request.json()

    if (!amount || Number(amount) < 10) {
      return NextResponse.json({ error: "Insufficient amount. A minimum of $10 is required." }, { status: 400 })
    }

    console.log(`Processing direct investment of $${amount} in ${currency}`)

    // Make the investment
    let result

    if (useMock) {
      console.log("Using mock implementation for direct investment")
      result = await mockBuyCryptocurrency(Number(amount), currency)
    } else {
      // Buy the cryptocurrency
      result = await buyCryptocurrency(Number(amount), currency)
    }

    console.log("Investment successful:", result)

    return NextResponse.json({
      success: true,
      message: `Successfully invested $${amount} in ${currency}`,
      transaction: {
        id: result.data.id,
        amount: Number(amount),
        cryptocurrency: currency,
        date: new Date().toISOString(),
        status: result.data.status || "completed",
      },
    })
  } catch (error: any) {
    console.error("Error in direct investment:", error)

    // If we get a Coinbase API error, return a more specific error message
    if (error.message && error.message.includes("Coinbase API error")) {
      return NextResponse.json(
        {
          error: "Failed to process investment",
          details: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to process investment",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
