import { NextResponse } from "next/server"
import {
  depositFiat,
  buyCryptocurrency,
  getAccountBalance,
  getPaymentMethods,
  validateCoinbaseEnv,
  mockDepositAndBuy,
  getAccountInfo,
  depositAndBuy,
} from "@/lib/coinbase-server"

export async function POST(request: Request) {
  try {
    validateCoinbaseEnv()

    const { action, amount, currency, useMock } = await request.json()

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    console.log(`Executing Coinbase test: ${action}`, { amount, currency, useMock })

    let result

    // Use mock implementation if requested
    if (useMock) {
      console.log("Using mock implementation for Coinbase test")

      switch (action) {
        case "deposit":
          result = {
            data: {
              id: `mock-deposit-${Date.now()}`,
              status: "completed",
              amount: { amount: amount || "10.00", currency: "USD" },
            },
          }
          break
        case "buy":
          result = {
            success: true,
            order_id: `mock-buy-${Date.now()}`,
            product_id: `${currency || "BTC"}-USD`,
            side: "BUY",
            client_order_id: `mock-client-order-${Date.now()}`,
          }
          break
        case "balance":
          result = { data: { balance: { amount: "100.00", currency: "USD" } } }
          break
        case "payment-methods":
          result = { data: [{ id: "mock-payment-method", name: "Mock Bank Account", type: "ach_bank_account" }] }
          break
        case "deposit-and-buy":
          result = await mockDepositAndBuy(Number(amount) || 10, currency || "BTC")
          break
        case "account-info":
          result = {
            data: [
              {
                id: "mock-account-id",
                name: "Mock Account",
                primary: true,
                type: "wallet",
                currency: {
                  code: "USD",
                  name: "United States Dollar",
                },
                balance: {
                  amount: "100.00",
                  currency: "USD",
                },
              },
            ],
          }
          break
        default:
          return NextResponse.json({ error: "Invalid action" }, { status: 400 })
      }
    } else {
      // Use real implementation
      switch (action) {
        case "deposit":
          if (!amount) {
            return NextResponse.json({ error: "Amount is required for deposit" }, { status: 400 })
          }
          result = await depositFiat(Number.parseFloat(amount))
          break
        case "buy":
          if (!amount || !currency) {
            return NextResponse.json({ error: "Amount and currency are required for buy" }, { status: 400 })
          }
          result = await buyCryptocurrency(Number.parseFloat(amount), currency)
          break
        case "balance":
          result = await getAccountBalance()
          break
        case "payment-methods":
          result = await getPaymentMethods()
          break
        case "deposit-and-buy":
          if (!amount || !currency) {
            return NextResponse.json({ error: "Amount and currency are required for deposit-and-buy" }, { status: 400 })
          }
          result = await depositAndBuy(Number.parseFloat(amount), currency)
          break
        case "account-info":
          result = await getAccountInfo()
          break
        default:
          return NextResponse.json({ error: "Invalid action" }, { status: 400 })
      }
    }

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error: any) {
    console.error("Error in Coinbase test:", error)
    return NextResponse.json(
      {
        error: "Failed to execute Coinbase test",
        details: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
