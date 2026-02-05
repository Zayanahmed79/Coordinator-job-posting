"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Jobs", href: "#jobs" },
    { name: "Why Coordinators", href: "#why-were-better" },
    { name: "Blog", href: "https://coordinators.pro/blog" },
    { name: "FAQ", href: "#faqs" },
  ]

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 sm:py-5 py-3",
          isScrolled ? "bg-white shadow-sm" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <img src="/logo.png" alt="coordinators.pro" className="sm:h-16 h-12 w-auto" />
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-12 font-medium text-md">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-60 bg-white transition-transform duration-300 md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-12">
            <img src="/logo.png" alt="coordinators.pro" className="h-12 w-auto" />
            <button 
              className=" text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={28} />
            </button> 
          </div>
          <nav className="flex flex-col gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
