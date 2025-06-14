import { NextResponse } from "next/server"
import { getUserData, updateUserData } from "@/lib/user-server"
import { buyCryptocurrency, validateCoinbaseEnv, mockBuyCryptocurrency } from "@/lib/coinbase-server"

export async function POST(request: Request) {
  try {
    // Validate Coinbase environment variables
    validateCoinbaseEnv()

    const { userId, useMock } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`Processing auto-invest for user ${userId}`)

    // Get user data to check preferences and roundup total
    const userData = getUserData(userId)

    if (!userData.coinbaseConnected) {
      console.error(`User ${userId} does not have Coinbase connected`)
      return NextResponse.json({ error: "Coinbase is not connected for this user" }, { status: 404 })
    }

    // Get the user's threshold and selected coin
    const threshold = userData.threshold || 10 // Default to 10 if not set
    const selectedCoin = userData.selectedCoin || "BTC" // Default to BTC if not set

    console.log(`User threshold: ${threshold}, selected coin: ${selectedCoin}`)

    // Calculate total roundups from transactions
    // Fetch from the Plaid transactions API
    const transactionsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/plaid/transactions?userId=${userId}`,
      {
        headers: { "Content-Type": "application/json" },
      },
    )

    if (!transactionsResponse.ok) {
      const errorText = await transactionsResponse.text()
      console.error(`Failed to fetch transactions: ${errorText}`)
      return NextResponse.json({ error: `Failed to fetch transactions: ${errorText}` }, { status: 500 })
    }

    const transactionsData = await transactionsResponse.json()

    if (transactionsData.error) {
      console.error(`Error in transactions data: ${transactionsData.error}`)
      return NextResponse.json({ error: `Failed to fetch transactions: ${transactionsData.error}` }, { status: 500 })
    }

    const transactions = transactionsData.transactions || []
    console.log(`Found ${transactions.length} transactions`)

    // Filter out already invested transactions
    const investedTransactions = userData.investedTransactions || []
    const uninvestedTransactions = transactions.filter((tx) => !investedTransactions.includes(tx.id))

    console.log(`Found ${uninvestedTransactions.length} uninvested transactions`)

    const totalRoundups = uninvestedTransactions.reduce((sum: number, tx: any) => sum + tx.roundup, 0)
    console.log(`Total roundups: ${totalRoundups.toFixed(2)}, threshold: ${threshold}`)

    // Check if roundups meet the threshold
    if (totalRoundups < threshold) {
      return NextResponse.json({
        success: false,
        message: "Roundup total does not meet the threshold yet",
        currentTotal: totalRoundups,
        threshold: threshold,
      })
    }

    console.log(`Threshold met! Auto-investing ${totalRoundups.toFixed(2)} in ${selectedCoin}`)

    // If threshold is met, make the investment
    let result

    if (useMock) {
      console.log("Using mock implementation for auto-invest")
      result = await mockBuyCryptocurrency(totalRoundups, selectedCoin)
    } else {
      // Buy the cryptocurrency
      result = await buyCryptocurrency(totalRoundups, selectedCoin)
    }

    console.log("Investment successful:", result)

    // Update user data to mark transactions as invested
    await updateUserData(userId, {
      lastInvestmentAmount: totalRoundups,
      lastInvestmentDate: new Date().toISOString(),
      lastInvestmentCoin: selectedCoin,
      investedTransactions: [...investedTransactions, ...uninvestedTransactions.map((tx) => tx.id)],
    })

    return NextResponse.json({
      success: true,
      message: `Successfully invested ${totalRoundups.toFixed(2)} in ${selectedCoin}`,
      transaction: {
        id: result.data.id,
        amount: totalRoundups,
        cryptocurrency: selectedCoin,
        date: new Date().toISOString(),
        status: result.data.status || "completed",
      },
    })
  } catch (error: any) {
    console.error("Error in auto-invest:", error)

    // If we get a Coinbase API error, return a more specific error message
    if (error.message && error.message.includes("Coinbase API error")) {
      return NextResponse.json(
        {
          error: "Failed to process auto-investment",
          details: error.message,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to process auto-investment",
        details: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
