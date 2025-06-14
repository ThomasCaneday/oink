import { NextResponse } from "next/server"
import { validateCoinbaseEnv, depositFiat, buyCryptocurrency } from "@/lib/coinbase-server"

export async function POST(request: Request) {
  try {
    // Validate Coinbase environment variables
    validateCoinbaseEnv()

    // Parse the request body
    const data = await request.json().catch(() => ({}))

    // Get parameters with defaults
    const threshold = data.threshold || "10.00" // default deposit/invest amount is $10.00
    const cryptoSymbol = data.crypto_symbol || "BTC" // default crypto is BTC
    const useMock = data.useMock || false

    // Ensure we have all required environment variables
    const apiKey = process.env.COINBASE_API_KEY
    const apiSecret = process.env.COINBASE_API_SECRET
    const accountId = process.env.COINBASE_ACCOUNT_ID
    const paymentMethodId = process.env.COINBASE_PAYMENT_METHOD_ID

    if (!apiKey || !apiSecret || !accountId || !paymentMethodId) {
      return NextResponse.json(
        {
          error: "Missing Coinbase configuration. Ensure your API keys and IDs are set.",
        },
        { status: 500 },
      )
    }

    console.log(`Processing deposit and buy: $${threshold} of ${cryptoSymbol}${useMock ? " (mock)" : ""}`)

    // If using mock mode, return mock data
    if (useMock) {
      return NextResponse.json({
        success: true,
        deposit_response: {
          id: `mock-deposit-${Date.now()}`,
          status: "completed",
          amount: { amount: threshold, currency: "USD" },
        },
        order_details: {
          success: true,
          order_id: `mock-buy-${Date.now()}`,
          product_id: `${cryptoSymbol}-USD`,
          side: "BUY",
          client_order_id: `clientOrderIdVercel1`,
        },
      })
    }

    // Step 1: Deposit fiat (USD) into Coinbase account
    let depositResponse
    try {
      depositResponse = await depositFiat(Number.parseFloat(threshold))
      console.log("Deposit completed successfully:", depositResponse)
    } catch (error) {
      console.error("Failed to execute Coinbase deposit:", error)
      return NextResponse.json(
        {
          error: "Failed to execute Coinbase deposit",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }

    // Wait for deposit to be processed (in a real app, you would poll for status)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Step 2: Place a market order buy for the chosen crypto
    let orderDetails
    try {
      // Build the product_id in the format "CRYPTO-USD" (e.g. "BTC-USD")
      const productId = `${cryptoSymbol.toUpperCase()}-USD`

      // Execute the market buy
      orderDetails = await buyCryptocurrency(Number.parseFloat(threshold), cryptoSymbol)
      console.log("Market buy completed successfully:", orderDetails)
    } catch (error) {
      console.error("Failed to execute Coinbase market order:", error)
      return NextResponse.json(
        {
          error: "Failed to execute Coinbase market order",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }

    // Combine both responses into one result
    return NextResponse.json({
      success: true,
      deposit_response: depositResponse,
      order_details: orderDetails,
    })
  } catch (error: any) {
    console.error("Error in deposit-and-buy:", error)
    return NextResponse.json(
      {
        error: "Failed to process deposit and buy",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
