"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NetworkToggle } from "@/components/network-toggle"
import { TokenPrice } from "@/components/token-price"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group relative">
            <div className="relative">
              <Image
                src="/images/midnightexplorer-logo.png"
                alt="Midnightexplorer Logo"
                width={180}
                height={40}
                className="h-6 w-auto brightness-200"
              />
              {/* Twinkling stars around logo */}
              <Sparkles
                className="h-3 w-3 text-cyan-400 absolute -top-1 -right-2 animate-pulse"
                style={{ animationDuration: "2s" }}
              />
              <Sparkles
                className="h-2 w-2 text-purple-400 absolute -bottom-1 -left-2 animate-pulse"
                style={{ animationDuration: "3s", animationDelay: "0.5s" }}
              />
              <Sparkles
                className="h-2 w-2 text-blue-300 absolute top-0 left-12 animate-pulse"
                style={{ animationDuration: "2.5s", animationDelay: "1s" }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center flex-1 justify-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/blocks"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Blocks
            </Link>
            <Link
              href="/transactions"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Transactions
            </Link>
            <Link
              href="/contracts"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contracts
            </Link>
            <Link
              href="/pool"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Pool
            </Link>
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSfBguf59QpRRgVVFZCWt8S2D6W9aGlB8QEpxIfVJrrwH3fjUw/viewform?usp=publish-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors hover:text-primary"  
            >
              Feedback
            </Link>

            <Link
              href="https://reviews.projectcatalyst.io/proposal/2042"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Project Catalyst
            </Link>

          </nav>

          <div className="hidden md:flex items-center gap-3">
            <TokenPrice />
            <NetworkToggle />
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <TokenPrice />
            <NetworkToggle />
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/blocks" className="text-lg font-medium hover:text-primary transition-colors">
                    Blocks
                  </Link>
                  <Link href="/transactions" className="text-lg font-medium hover:text-primary transition-colors">
                    Transactions
                  </Link>
                  <Link href="/contracts" className="text-lg font-medium hover:text-primary transition-colors">
                    Contracts
                  </Link>
                  <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                    Pool
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}