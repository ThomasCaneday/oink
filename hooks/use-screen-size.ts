"use client"

import { useState, useEffect } from "react"

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isMobile: typeof window !== "undefined" ? window.innerWidth < 768 : false,
    isTablet: typeof window !== "undefined" ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
    isDesktop: typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
  })

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        isDesktop: window.innerWidth >= 1024,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return screenSize
}
