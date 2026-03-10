"use client";

import Link from "next/link";
import Image from "next/image";
import { NetworkToggle } from "@/components/network-toggle";
import { SearchBar } from "@/components/search-bar";
import { getMenu } from "@/lib/menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/images/midnightexplorer-logo.png"
                alt="Midnightexplorer Logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-sm object-cover hidden sm:block"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="font-bold text-lg tracking-tight whitespace-nowrap hidden sm:block">
                Midnight Explorer
              </span>
              {/* Fallback for when logo alone isn't enough */}
              <span className="font-bold text-lg tracking-tight sm:hidden block text-primary">
                ME
              </span>
            </Link>

            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3 text-sm font-medium">
                    Blockchain
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-2 p-3">
                      {getMenu().map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              target={item.external ? "_blank" : undefined}
                              rel={item.external ? "noopener noreferrer" : undefined}
                              className="block select-none space-y-1 rounded-sm p-2 leading-none no-underline outline-none transition-colors hover:bg-muted/50 focus:bg-muted focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{item.title}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-2xl px-4 hidden md:block">
            <SearchBar />
          </div>

          {/* Right: Network Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <NetworkToggle />
          </div>

        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden border-t px-4 py-2 bg-muted/20">
        <SearchBar />
      </div>
    </header>
  );
}
