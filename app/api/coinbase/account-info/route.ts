import { NextResponse } from "next/server"
import { getAccountBalance, getPaymentMethods, validateCoinbaseEnv } from "@/lib/coinbase-server"

export async function GET(request: Request) {
  try {
    validateCoinbaseEnv()

    // Get account balance and payment methods
    const balance = await getAccountBalance()
    const paymentMethods = await getPaymentMethods()

    return NextResponse.json({
      success: true,
      balance,
      paymentMethods: paymentMethods.map((method: any) => ({
        id: method.id,
        name: method.name,
        type: method.type,
        currency: method.currency,
        primary: method.primary,
        verified: method.verified,
      })),
    })
  } catch (error) {
    console.error("Error fetching account info:", error)

    // If we get a Coinbase API error, return a more specific error message
    if (error.message && error.message.includes("Coinbase API error")) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details || "No additional details available",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "Failed to fetch account info" }, { status: 500 })
  }
}
