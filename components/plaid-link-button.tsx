"use client"

import { useState, useEffect } from "react"
import { usePlaidLink } from "react-plaid-link"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"

interface PlaidLinkButtonProps {
  userId: string
  onSuccess: () => void
  onExit?: () => void
  isLoading?: boolean
  buttonText?: string
}

export function PlaidLinkButton({
  userId,
  onSuccess,
  onExit,
  isLoading = false,
  buttonText = "Connect Bank Account",
}: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [buttonLoading, setButtonLoading] = useState(false)

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch("/api/plaid/link-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        })
        const data = await response.json()
        if (data.linkToken) {
          setLinkToken(data.linkToken)
        } else {
          console.error("Failed to create link token:", data.error)
        }
      } catch (error) {
        console.error("Error creating link token:", error)
      }
    }

    createLinkToken()
  }, [userId])

  const { open, ready } = usePlaidLink({
    token: linkToken || "",
    onSuccess: async (public_token) => {
      setButtonLoading(true)
      try {
        // Exchange the public token for an access token (stored server-side)
        const response = await fetch("/api/plaid/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicToken: public_token, userId }),
        })

        const data = await response.json()

        if (data.success) {
          // Notify parent component of success
          onSuccess()
        } else {
          console.error("Failed to exchange token:", data.error)
        }
      } catch (error) {
        console.error("Error exchanging token:", error)
      } finally {
        setButtonLoading(false)
      }
    },
    onExit: (err, metadata) => {
      if (onExit) onExit()
    },
  })

  return (
    <Button
      onClick={() => open()}
      disabled={!ready || !linkToken || isLoading || buttonLoading}
      className="w-full bg-pink-500 hover:bg-pink-600"
    >
      <CreditCard className="mr-2 h-4 w-4" />
      {isLoading || buttonLoading ? "Connecting..." : buttonText}
    </Button>
  )
}
