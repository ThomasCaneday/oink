"use server"

import { revalidatePath } from "next/cache"
import { updateUserData } from "@/lib/user-server"

export async function saveUserPreferences(userId: string, formData: FormData) {
  try {
    const roundupFrequency = formData.get("roundupFrequency") as string
    const threshold = Number(formData.get("threshold"))
    const selectedCoin = formData.get("selectedCoin") as string

    // Store preferences securely on the server
    await updateUserData(userId, {
      roundupFrequency,
      threshold,
      selectedCoin,
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error saving user preferences:", error)
    return { error: "Failed to save user preferences" }
  }
}

export async function connectCoinbaseAccount(userId: string) {
  try {
    // Instead of storing user-specific credentials, we'll just mark the account as connected
    // The actual API calls will use the environment variables
    await updateUserData(userId, {
      coinbaseConnected: true,
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error connecting Coinbase account:", error)
    return { error: "Failed to connect Coinbase account" }
  }
}
