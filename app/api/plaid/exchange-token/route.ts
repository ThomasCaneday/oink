import { NextResponse } from "next/server"
import { getPlaidClient, validatePlaidEnv } from "@/lib/plaid-server"
import { storePlaidToken } from "@/lib/user-server"

export async function POST(request: Request) {
  try {
    validatePlaidEnv()
    const plaidClient = getPlaidClient()

    const { publicToken, userId } = await request.json()

    if (!publicToken || !userId) {
      return NextResponse.json({ error: "Public token and user ID are required" }, { status: 400 })
    }

    // Exchange the public token for an access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    })

    const accessToken = exchangeResponse.data.access_token
    const itemId = exchangeResponse.data.item_id

    // Store the access token securely on the server
    await storePlaidToken(userId, accessToken, itemId)

    // Return success but NOT the access token
    return NextResponse.json({
      success: true,
      message: "Bank account connected successfully",
    })
  } catch (error) {
    console.error("Error exchanging token:", error)

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

    return NextResponse.json({ error: "Failed to exchange token" }, { status: 500 })
  }
}
