import { NextResponse } from "next/server"
import { listHeldCryptoBalances, validateCoinbaseEnv } from "@/lib/coinbase-server"

export async function GET(request: Request) {
  try {
    // Validate Coinbase environment variables
    validateCoinbaseEnv()

    // If using mock mode (determined by query parameter)
    const { searchParams } = new URL(request.url)
    const useMock = searchParams.get("mock") === "true"

    if (useMock) {
      // Return mock balances
      return NextResponse.json({
        success: true,
        balances: {
          BTC: { amount: 0.05, currency: "BTC", name: "Bitcoin", id: "mock-btc-id" },
          ETH: { amount: 1.2, currency: "ETH", name: "Ethereum", id: "mock-eth-id" },
          SOL: { amount: 10, currency: "SOL", name: "Solana", id: "mock-sol-id" },
        },
      })
    }

    // Get real balances from Coinbase
    const balances = await listHeldCryptoBalances()

    return NextResponse.json({
      success: true,
      balances,
    })
  } catch (error: any) {
    console.error("Error fetching balances:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch balances",
        details: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
