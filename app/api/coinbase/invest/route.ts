import { NextResponse } from "next/server"
import { getUserData } from "@/lib/user-server"
import { buyCryptocurrency, validateCoinbaseEnv } from "@/lib/coinbase-server"

export async function POST(request: Request) {
  try {
    validateCoinbaseEnv()

    const { amount, cryptocurrency, userId } = await request.json()

    if (!amount || !cryptocurrency || !userId) {
      return NextResponse.json({ error: "Amount, cryptocurrency, and user ID are required" }, { status: 400 })
    }

    // Get user data to check if they have Coinbase enabled
    const userData = getUserData(userId)

    if (!userData.coinbaseConnected) {
      return NextResponse.json({ error: "Coinbase is not connected for this user" }, { status: 404 })
    }

    // Use the environment variables for Coinbase API credentials and account details
    const result = await buyCryptocurrency(amount, cryptocurrency)

    return NextResponse.json({
      success: true,
      transaction: {
        id: result.data.id,
        amount,
        cryptocurrency,
        date: new Date().toISOString(),
        status: result.data.status,
        details: result.data,
      },
    })
  } catch (error) {
    console.error("Error making investment:", error)

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

    return NextResponse.json({ error: "Failed to make investment" }, { status: 500 })
  }
}
