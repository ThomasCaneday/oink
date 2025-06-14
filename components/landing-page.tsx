"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

export function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          className="mx-auto mb-8 w-64 h-64 relative"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            initial={{ rotate: 0 }}
            animate={{ rotate: isHovered ? [0, -5, 5, -3, 3, 0] : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Pig body */}
            <motion.path
              d="M85,50 C85,70 70,85 50,85 C30,85 15,70 15,50 C15,30 30,15 50,15 C70,15 85,30 85,50 Z"
              fill="none"
              stroke="#FF6B9D"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            {/* Pig ears */}
            <motion.path
              d="M25,30 C20,20 25,15 30,20"
              fill="none"
              stroke="#FF6B9D"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.path
              d="M75,30 C80,20 75,15 70,20"
              fill="none"
              stroke="#FF6B9D"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            />
            {/* Pig nose */}
            <motion.ellipse
              cx="50"
              cy="60"
              rx="10"
              ry="8"
              fill="none"
              stroke="#FF6B9D"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
            />
            {/* Pig nostrils */}
            <motion.circle
              cx="46"
              cy="60"
              r="2"
              fill="#FF6B9D"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
            />
            <motion.circle
              cx="54"
              cy="60"
              r="2"
              fill="#FF6B9D"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
            />
            {/* Pig tail */}
            <motion.path
              d="M85,50 C90,45 92,50 90,55"
              fill="none"
              stroke="#FF6B9D"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
            />
            {/* Coin slot */}
            <motion.path
              d="M40,25 L60,25"
              fill="none"
              stroke="#FF6B9D"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 1.2 }}
            />
          </motion.svg>

          {/* Animated coins */}
          {isHovered && (
            <>
              <motion.div
                className="absolute w-6 h-6 rounded-full bg-yellow-400 border-2 border-yellow-500"
                initial={{ top: "-20%", left: "50%", opacity: 1 }}
                animate={{ top: "20%", opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeIn" }}
              />
              <motion.div
                className="absolute w-5 h-5 rounded-full bg-yellow-400 border-2 border-yellow-500"
                initial={{ top: "-15%", left: "45%", opacity: 1 }}
                animate={{ top: "20%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeIn", delay: 0.2 }}
              />
            </>
          )}
        </motion.div>

        <motion.h1
          className="mb-2 text-4xl font-bold text-pink-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Oink
        </motion.h1>

        <motion.p
          className="mb-8 text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Turn your spare change into crypto investments
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 rounded-full text-lg">
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-pink-500 text-pink-500 hover:bg-pink-50 px-8 py-6 rounded-full text-lg"
          >
            <Link href="/login">Login</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-16 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>© 2025 Oink. All rights reserved.</p>
      </motion.div>
    </div>
  )
}
