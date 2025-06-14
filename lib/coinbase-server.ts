import crypto from "crypto"
import axios from "axios"

// Validate that required environment variables are set
export function validateCoinbaseEnv() {
  const requiredEnvVars = [
    "COINBASE_API_KEY",
    "COINBASE_API_SECRET",
    "COINBASE_ACCOUNT_ID",
    "COINBASE_PAYMENT_METHOD_ID",
  ]
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`)
  }
}

// Helper function to make authenticated requests to Coinbase API v2
async function coinbaseRequestV2(method: string, endpoint: string, body?: any): Promise<any> {
  try {
    // Use environment variables for API credentials
    const apiKey = process.env.COINBASE_API_KEY!
    const apiSecret = process.env.COINBASE_API_SECRET!

    const timestamp = Math.floor(Date.now() / 1000).toString()
    const requestPath = `/v2/${endpoint}`
    const baseUrl = "https://api.coinbase.com"
    const url = `${baseUrl}${requestPath}`

    // Create the message to sign
    const bodyString = body ? JSON.stringify(body) : ""
    const message = timestamp + method + requestPath + bodyString

    // Create the signature
    const signature = crypto.createHmac("sha256", apiSecret).update(message).digest("hex")

    // Make the request
    const response = await axios({
      method,
      url,
      data: body,
      headers: {
        "Content-Type": "application/json",
        "CB-ACCESS-KEY": apiKey,
        "CB-ACCESS-SIGN": signature,
        "CB-ACCESS-TIMESTAMP": timestamp,
        "CB-VERSION": "2023-04-13", // Adding the CB-VERSION header for API version compatibility
      },
    })

    return response.data
  } catch (error: any) {
    console.error("Coinbase API error:", error.response?.data || error.message)
    throw new Error(`Coinbase API error: ${error.response?.data?.errors?.[0]?.message || error.message}`)
  }
}

// Function to deposit fiat currency into Coinbase account
export async function depositFiat(amount: number) {
  try {
    validateCoinbaseEnv()

    const accountId = process.env.COINBASE_ACCOUNT_ID!
    const paymentMethodId = process.env.COINBASE_PAYMENT_METHOD_ID!

    const depositData = {
      amount: amount.toFixed(2),
      currency: "USD",
      payment_method: paymentMethodId,
    }

    const result = await coinbaseRequestV2("POST", `accounts/${accountId}/deposits`, depositData)
    return result.data
  } catch (error: any) {
    console.error("Error depositing fiat:", error)
    throw error
  }
}

// Function to directly buy cryptocurrency with USD
export async function buyCryptocurrency(amount: number, currency = "BTC") {
  try {
    validateCoinbaseEnv()

    const accountId = process.env.COINBASE_ACCOUNT_ID!
    const paymentMethodId = process.env.COINBASE_PAYMENT_METHOD_ID!

    if (amount < 10) {
      throw new Error("Insufficient amount. A minimum of $10 is required.")
    }

    // Create the buy request
    const buyData = {
      amount: amount.toFixed(2),
      currency: "USD",
      payment_method: paymentMethodId,
      commit: true,
    }

    // Make the buy request
    const result = await coinbaseRequestV2("POST", `accounts/${accountId}/buys`, buyData)

    return {
      success: true,
      data: result.data,
      message: "Coinbase investment initiated successfully.",
    }
  } catch (error: any) {
    console.error("Error buying cryptocurrency:", error)
    throw error
  }
}

// Function to execute a market buy order
export async function fiatMarketBuy(productId: string, amount: string) {
  try {
    validateCoinbaseEnv()

    const accountId = process.env.COINBASE_ACCOUNT_ID!

    const orderData = {
      type: "market",
      side: "buy",
      product_id: productId,
      funds: amount,
    }

    const result = await coinbaseRequestV2("POST", `accounts/${accountId}/orders`, orderData)
    return result.data
  } catch (error: any) {
    console.error("Error executing market buy:", error)
    throw error
  }
}

// Function to get account balance
export async function getAccountBalance() {
  try {
    validateCoinbaseEnv()
    const accountId = process.env.COINBASE_ACCOUNT_ID!
    const result = await coinbaseRequestV2("GET", `accounts/${accountId}`)
    return result.data.balance
  } catch (error) {
    console.error("Error getting account balance:", error)
    throw error
  }
}

// Function to get account information
export async function getAccountInfo() {
  try {
    validateCoinbaseEnv()
    const accountId = process.env.COINBASE_ACCOUNT_ID!
    const result = await coinbaseRequestV2("GET", `accounts/${accountId}`)
    return result.data
  } catch (error) {
    console.error("Error getting account info:", error)
    throw error
  }
}

// Function to get payment methods
export async function getPaymentMethods() {
  try {
    validateCoinbaseEnv()
    const result = await coinbaseRequestV2("GET", "payment-methods")
    return result.data
  } catch (error) {
    console.error("Error getting payment methods:", error)
    throw error
  }
}

// Function to deposit and buy cryptocurrency in one step
export async function depositAndBuy(amount: number, currency = "BTC") {
  try {
    validateCoinbaseEnv()

    // Deposit fiat
    const depositResult = await depositFiat(amount)

    // Buy cryptocurrency
    const buyResult = await buyCryptocurrency(amount, currency)

    return {
      deposit: depositResult,
      buy: buyResult,
    }
  } catch (error: any) {
    console.error("Error depositing and buying:", error)
    throw error
  }
}

// Function to list all accounts and their balances
export async function listAccounts() {
  try {
    validateCoinbaseEnv()
    const result = await coinbaseRequestV2("GET", "accounts")
    return result.data
  } catch (error) {
    console.error("Error listing accounts:", error)
    throw error
  }
}

// Function to list all non-zero crypto balances
export async function listHeldCryptoBalances() {
  try {
    validateCoinbaseEnv()
    const accounts = await coinbaseRequestV2("GET", "accounts")

    // Filter accounts with non-zero balances
    const nonZeroBalances: Record<string, any> = {}

    accounts.data.forEach((account: any) => {
      const balance = Number.parseFloat(account.balance.amount)
      if (balance > 0 && account.currency.code !== "USD") {
        nonZeroBalances[account.currency.code] = {
          amount: balance,
          currency: account.currency.code,
          name: account.name,
          id: account.id,
        }
      }
    })

    return nonZeroBalances
  } catch (error) {
    console.error("Error listing held crypto balances:", error)
    throw error
  }
}

// Function to get a specific crypto balance
export async function getCryptoBalance(currency: string) {
  try {
    validateCoinbaseEnv()
    const accounts = await coinbaseRequestV2("GET", "accounts")

    // Find the account with the specified currency
    const account = accounts.data.find((acc: any) => acc.currency.code === currency)

    if (account) {
      return Number.parseFloat(account.balance.amount)
    }

    return 0 // Return 0 if no account is found
  } catch (error) {
    console.error(`Error getting ${currency} balance:`, error)
    throw error
  }
}

// Mock implementation for testing
export async function mockBuyCryptocurrency(amount: number, currency: string) {
  console.log(`[MOCK] Buying ${amount.toFixed(2)} of ${currency}`)

  return {
    success: true,
    data: {
      id: `mock-buy-${Date.now()}`,
      status: "completed",
      amount: { amount: amount.toFixed(2), currency: "USD" },
      total: { amount: amount.toFixed(2), currency: "USD" },
      subtotal: { amount: amount.toFixed(2), currency: "USD" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resource: "buy",
      resource_path: `/v2/accounts/mock-account/buys/mock-buy-${Date.now()}`,
      payment_method: {
        id: "mock-payment-method",
        resource: "payment_method",
        resource_path: "/v2/payment-methods/mock-payment-method",
      },
      transaction: {
        id: `mock-transaction-${Date.now()}`,
        resource: "transaction",
        resource_path: `/v2/accounts/mock-account/transactions/mock-transaction-${Date.now()}`,
      },
      amount_fee: { amount: "0.00", currency: "USD" },
      fee: { amount: "0.00", currency: "USD" },
      committed: true,
      payout_at: new Date().toISOString(),
    },
    message: "Coinbase investment initiated successfully.",
  }
}

// Mock implementation for deposit and buy
export async function mockDepositAndBuy(amount: number, currency: string) {
  console.log(`[MOCK] Depositing and buying ${amount.toFixed(2)} of ${currency}`)

  const depositResponse = {
    id: `mock-deposit-${Date.now()}`,
    status: "completed",
    amount: { amount: amount.toFixed(2), currency: "USD" },
  }

  const orderDetails = {
    success: true,
    order_id: `mock-buy-${Date.now()}`,
    product_id: `${currency}-USD`,
    side: "BUY",
    client_order_id: `clientOrderIdVercel1`,
  }

  return {
    deposit_response: depositResponse,
    order_details: orderDetails,
  }
}
