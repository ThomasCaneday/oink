"use server"

import { revalidatePath } from "next/cache"
import { getUserData, updateUserData } from "@/lib/user-server"
import { buyCryptocurrency, validateCoinbaseEnv, mockBuyCryptocurrency } from "@/lib/coinbase-server"

export async function checkAndProcessAutoInvestments(useMock = false) {
  try {
    validateCoinbaseEnv()

    // In a real app, you would fetch all users who have enabled auto-invest
    // For this demo, we'll just use our demo user
    const userId = "demo-user"
    const userData = getUserData(userId)

    if (!userData.coinbaseConnected) {
      console.log(`User ${userId} does not have Coinbase connected`)
      return { success: false, message: "Coinbase not connected" }
    }

    // Get the user's threshold and selected coin
    const threshold = userData.threshold || 10
    const selectedCoin = userData.selectedCoin || "BTC"

    // Fetch transactions to calculate roundups
    // In a real app, this would be a database query
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/plaid/transactions?userId=${userId}`, {
      headers: { "Content-Type": "application/json" },
    })

    const data = await response.json()
    if (data.error) {
      console.error(`Failed to fetch transactions: ${data.error}`)
      return { success: false, error: `Failed to fetch transactions: ${data.error}` }
    }

    const transactions = data.transactions || []

    // Filter out already invested transactions
    const investedTransactions = userData.investedTransactions || []
    const uninvestedTransactions = transactions.filter((tx: any) => !investedTransactions.includes(tx.id))

    const totalRoundups = uninvestedTransactions.reduce((sum: number, tx: any) => sum + tx.roundup, 0)

    // Check if roundups meet the threshold
    if (totalRoundups < threshold) {
      return {
        success: false,
        message: `Roundup total (${totalRoundups.toFixed(2)}) does not meet the threshold (${threshold})`,
        currentTotal: totalRoundups,
        threshold: threshold,
      }
    }

    // If threshold is met, make the investment
    let result
    if (useMock) {
      result = await mockBuyCryptocurrency(totalRoundups, selectedCoin)
    } else {
      result = await buyCryptocurrency(totalRoundups, selectedCoin)
    }

    // Update user data to reflect the investment
    await updateUserData(userId, {
      lastInvestmentAmount: totalRoundups,
      lastInvestmentDate: new Date().toISOString(),
      lastInvestmentCoin: selectedCoin,
      investedTransactions: [...investedTransactions, ...uninvestedTransactions.map((t: any) => t.id)],
    })

    revalidatePath("/dashboard")

    return {
      success: true,
      message: `Successfully invested ${totalRoundups.toFixed(2)} in ${selectedCoin}`,
      transaction: {
        id: result.data.id,
        amount: totalRoundups,
        cryptocurrency: selectedCoin,
        date: new Date().toISOString(),
        status: result.data.status || "completed",
      },
    }
  } catch (error: any) {
    console.error("Error in auto-investment process:", error)
    return { success: false, error: error.message || "Unknown error in auto-investment process" }
  }
}

// Function to manually trigger investment
export async function manualInvestRoundups(userId: string, useMock = false) {
  try {
    validateCoinbaseEnv()

    const userData = getUserData(userId)

    if (!userData.coinbaseConnected) {
      return { success: false, message: "Coinbase not connected" }
    }

    // Get the user's threshold and selected coin
    const threshold = userData.threshold || 10
    const selectedCoin = userData.selectedCoin || "BTC"

    // Fetch transactions to calculate roundups
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/plaid/transactions?userId=${userId}`, {
      headers: { "Content-Type": "application/json" },
    })

    const data = await response.json()
    if (data.error) {
      return { success: false, error: `Failed to fetch transactions: ${data.error}` }
    }

    const transactions = data.transactions || []

    // Filter out already invested transactions
    const investedTransactions = userData.investedTransactions || []
    const uninvestedTransactions = transactions.filter((tx: any) => !investedTransactions.includes(tx.id))

    const totalRoundups = uninvestedTransactions.reduce((sum: number, tx: any) => sum + tx.roundup, 0)

    // Check if roundups meet the threshold
    if (totalRoundups < threshold) {
      return {
        success: false,
        message: `Roundup total (${totalRoundups.toFixed(2)}) does not meet the threshold (${threshold})`,
        currentTotal: totalRoundups,
        threshold: threshold,
      }
    }

    // If threshold is met, make the investment
    let result
    if (useMock) {
      result = await mockBuyCryptocurrency(totalRoundups, selectedCoin)
    } else {
      result = await buyCryptocurrency(totalRoundups, selectedCoin)
    }

    // Update user data to reflect the investment
    await updateUserData(userId, {
      lastInvestmentAmount: totalRoundups,
      lastInvestmentDate: new Date().toISOString(),
      lastInvestmentCoin: selectedCoin,
      investedTransactions: [...investedTransactions, ...uninvestedTransactions.map((t: any) => t.id)],
    })

    revalidatePath("/dashboard")

    return {
      success: true,
      message: `Successfully invested ${totalRoundups.toFixed(2)} in ${selectedCoin}`,
      transaction: {
        id: result.data.id,
        amount: totalRoundups,
        cryptocurrency: selectedCoin,
        date: new Date().toISOString(),
        status: result.data.status || "completed",
      },
    }
  } catch (error: any) {
    console.error("Error in manual investment process:", error)
    return {
      success: false,
      error: error.message || "Unknown error in investment process",
    }
  }
}
