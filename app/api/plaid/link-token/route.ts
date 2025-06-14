import { NextResponse } from "next/server"
import { getPlaidClient, validatePlaidEnv } from "@/lib/plaid-server"
import { getUserData } from "@/lib/user-server"
import type { Products } from "plaid"

export async function POST(request: Request) {
  try {
    validatePlaidEnv()
    const plaidClient = getPlaidClient()

    // Get user ID from the request
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user data to check if they already have a Plaid connection
    const userData = getUserData(userId)

    // Create a link token with the user's ID
    const createTokenResponse = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: "Oink",
      products: ["transactions"] as Products[],
      language: "en",
      country_codes: ["US"],
    })

    return NextResponse.json({ linkToken: createTokenResponse.data.link_token })
  } catch (error) {
    console.error("Error creating link token:", error)
    return NextResponse.json({ error: "Failed to create link token" }, { status: 500 })
  }
}
