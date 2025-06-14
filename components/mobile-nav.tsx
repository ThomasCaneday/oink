import { DollarSign, PieChart, User, Wallet } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export function MobileNav() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <Image
            src="/placeholder.svg?height=32&width=32"
            alt="Penny Parlay logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="font-semibold">Penny Parlay</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <div className="flex flex-col gap-1 px-2">
          <Button variant="ghost" className="justify-start" asChild>
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Dashboard
            </div>
          </Button>
          <Button variant="ghost" className="justify-start text-muted-foreground" asChild>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Transactions
            </div>
          </Button>
          <Button variant="ghost" className="justify-start text-muted-foreground" asChild>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Investments
            </div>
          </Button>
          <Button variant="ghost" className="justify-start text-muted-foreground" asChild>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
