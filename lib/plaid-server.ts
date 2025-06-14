import { Configuration, PlaidApi, PlaidEnvironments } from "plaid"

// Initialize Plaid client with environment variables
export function getPlaidClient() {
  const configuration = new Configuration({
    basePath: PlaidEnvironments.production,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
        "PLAID-SECRET": process.env.PLAID_SECRET!,
      },
    },
  })

  return new PlaidApi(configuration)
}

// Validate that required environment variables are set
export function validatePlaidEnv() {
  const requiredEnvVars = ["PLAID_CLIENT_ID", "PLAID_SECRET"]
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`)
  }
}
