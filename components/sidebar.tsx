"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DollarSign, Home, PiggyBank, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface MainSidebarProps {
  isPremium?: boolean
}

export function MainSidebar({ isPremium = false }: MainSidebarProps) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="text-pink-500">
              <svg viewBox="0 0 100 100" className="h-6 w-6">
                <path d="M30,50 C30,65 45,80 65,75 C85,70 85,40 75,30 C65,20 45,20 30,50 Z" fill="#FF6B9D" />
                <circle cx="45" cy="40" r="3" fill="#FFF" />
              </svg>
            </div>
            <span className="font-semibold text-pink-600">Oink!</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/transactions"}>
                <Link href="/transactions" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Transactions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/portfolio"}>
                <Link href="/portfolio" className="flex items-center gap-2">
                  <PiggyBank className="h-4 w-4" />
                  <span>Portfolio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/account"}>
                <Link href="/account" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Account</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {!isPremium && (
            <div className="p-4">
              <div className="rounded-lg bg-pink-50 p-4 border border-pink-100">
                <h3 className="font-medium text-pink-600 mb-2">Upgrade to Premium</h3>
                <p className="text-sm text-gray-600 mb-3">Get advanced analytics, portfolio insights, and more.</p>
                <Button className="w-full bg-pink-500 hover:bg-pink-600">Upgrade Now</Button>
              </div>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
