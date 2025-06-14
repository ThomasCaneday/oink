import { NextResponse } from "next/server"
import { getUserData, updateUserData } from "@/lib/user-server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user data
    const userData = getUserData(userId)

    // Set Coinbase as connected
    await updateUserData(userId, {
      coinbaseConnected: true,
    })

    return NextResponse.json({
      success: true,
      message: "Coinbase connected successfully",
    })
  } catch (error) {
    console.error("Error connecting Coinbase:", error)
    return NextResponse.json({ error: "Failed to connect Coinbase" }, { status: 500 })
  }
}
