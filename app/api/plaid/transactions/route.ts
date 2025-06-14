import { NextResponse } from "next/server"
import { getPlaidClient, validatePlaidEnv } from "@/lib/plaid-server"
import { getPlaidAccessToken } from "@/lib/user-server"

export async function GET(request: Request) {
  try {
    validatePlaidEnv()
    const plaidClient = getPlaidClient()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get the access token from server-side storage
    const accessToken = await getPlaidAccessToken(userId)

    if (!accessToken) {
      return NextResponse.json({ error: "No Plaid connection found for this user" }, { status: 404 })
    }

    console.log(`Fetching transactions for user ${userId} with Plaid access token`)

    // Get transactions from Plaid
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // 30 days ago
    const endDate = new Date().toISOString().split("T")[0] // today

    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
    })

    console.log(`Retrieved ${response.data.transactions.length} transactions from Plaid`)

    const transactions = response.data.transactions.map((transaction) => {
      // Calculate roundup (to the nearest dollar)
      const amount = Math.abs(transaction.amount)
      const roundup = amount % 1 > 0 ? Number((1 - (amount % 1)).toFixed(2)) : 0

      return {
        id: transaction.transaction_id,
        date: transaction.date,
        name: transaction.name,
        amount: amount,
        roundup: roundup,
      }
    })

    return NextResponse.json({ transactions })
  } catch (error: any) {
    console.error("Error fetching transactions:", error)

    // If we get a PLAID_ERROR, return a more specific error message
    if (error.response?.data?.error_code) {
      return NextResponse.json(
        {
          error: `Plaid error: ${error.response.data.error_code}`,
          message: error.response.data.error_message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
