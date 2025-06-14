// In a real application, this would interact with your database
// For this demo, we'll use a simple in-memory store
// WARNING: This is not suitable for production use

import { cache } from "react"

interface UserData {
  userId: string
  plaidAccessToken?: string
  plaidItemId?: string
  coinbaseConnected?: boolean
  selectedCoin?: string
  roundupFrequency?: string
  threshold?: number
  lastInvestmentAmount?: number
  lastInvestmentDate?: string
  lastInvestmentCoin?: string
  investedTransactions?: string[] // Array of transaction IDs that have been invested
}

// In-memory store (NOT for production use)
const userStore: Record<string, UserData> = {}

// Get user data
export const getUserData = cache((userId: string): UserData => {
  if (!userStore[userId]) {
    userStore[userId] = { userId }
  }
  return userStore[userId]
})

// Update user data
export async function updateUserData(userId: string, data: Partial<UserData>) {
  if (!userStore[userId]) {
    userStore[userId] = { userId }
  }

  userStore[userId] = {
    ...userStore[userId],
    ...data,
  }

  return userStore[userId]
}

// Store Plaid access token
export async function storePlaidToken(userId: string, accessToken: string, itemId: string) {
  return updateUserData(userId, {
    plaidAccessToken: accessToken,
    plaidItemId: itemId,
  })
}

// Get Plaid access token
export async function getPlaidAccessToken(userId: string) {
  const userData = getUserData(userId)
  return userData.plaidAccessToken
}

// Get uninvested transactions
export async function getUninvestedTransactions(userId: string, transactions: any[]) {
  const userData = getUserData(userId)
  const investedTransactionIds = userData.investedTransactions || []

  return transactions.filter((tx) => !investedTransactionIds.includes(tx.id))
}

// Mark transactions as invested
export async function markTransactionsAsInvested(userId: string, transactionIds: string[]) {
  const userData = getUserData(userId)
  const currentInvestedIds = userData.investedTransactions || []

  return updateUserData(userId, {
    investedTransactions: [...currentInvestedIds, ...transactionIds],
  })
}
