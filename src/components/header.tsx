"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Sparkles } from "lucide-react";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getMenu } from "@/lib/menu";
import { NetworkToggle } from "@/components/network-toggle";
import { TokenPrice } from "@/components/token-price";

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
                className="h-6 w-auto min-w-[180px] brightness-200"
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
          <nav className="hidden lg:flex items-center flex-1 justify-center gap-6 mx-2">
            {getMenu().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Desktop: right side */}
          <div className="hidden lg:flex items-center gap-3">
            <TokenPrice />
            <NetworkToggle />
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="hidden sm:block">
              <NetworkToggle />
            </div>
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="mt-6 mb-4 px-4 space-y-4">
                  <TokenPrice />
                  <div className="sm:hidden">
                    <NetworkToggle />
                  </div>
                </div>

                <nav className="flex flex-col gap-1">
                  {getMenu().map((item, index, array) => {
                    const showSeparator =
                      item.external &&
                      array[index - 1] &&
                      !array[index - 1].external;
                    return (
                      <Fragment key={item.href}>
                        {showSeparator && (
                          <div className="my-2 border-t border-border" />
                        )}
                        <Link
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md"
                        >
                          {item.title}
                        </Link>
                      </Fragment>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
