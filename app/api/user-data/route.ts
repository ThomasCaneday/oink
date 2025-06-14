import { NextResponse } from "next/server"
import { getUserData } from "@/lib/user-server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user data
    const userData = getUserData(userId)

    return NextResponse.json({
      success: true,
      data: {
        userId: userData.userId,
        coinbaseConnected: userData.coinbaseConnected || false,
        selectedCoin: userData.selectedCoin || "BTC",
        roundupFrequency: userData.roundupFrequency || "every",
        threshold: userData.threshold || 10,
        lastInvestmentAmount: userData.lastInvestmentAmount,
        lastInvestmentDate: userData.lastInvestmentDate,
        lastInvestmentCoin: userData.lastInvestmentCoin,
        investedTransactions: userData.investedTransactions || [],
      },
    })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch user data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
