"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NetworkToggle } from "@/components/network-toggle"

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
          <nav className="hidden md:flex items-center flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Blockchain</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/blocks"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Blocks</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              View all blocks on the Midnight network
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/transactions"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Transactions</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Explore all transactions and their details
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Addresses</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Look up address balances and history
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Analytics</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                          >
                            <div className="text-sm font-medium leading-none">Network Charts</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Visualize network metrics and trends
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                          >
                            <div className="text-sm font-medium leading-none">Statistics</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Detailed network statistics and metrics
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    API
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="hidden md:block">
            <NetworkToggle />
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
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
                  <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                    Addresses
                  </Link>
                  <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                    Charts
                  </Link>
                  <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                    Statistics
                  </Link>
                  <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                    API
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
