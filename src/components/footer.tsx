"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Github, Mail, Sparkles } from "lucide-react"
import { useNetworkStats } from "@/hooks/useNetworkStats"
interface NetworkStats {
  blockHeight: number
  status: 'online' | 'offline'
}

export function Footer() {
  const [stats, setStats] = useState<NetworkStats>({
    blockHeight: 0,
    status: 'online'
  })
  const {latestBlock } = useNetworkStats()
 
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/network/stats')
        if (response.ok) {
          const data = await response.json()
          setStats({
            blockHeight: data.blockHeight,
            status: data.status
          })
        }
      } catch (error) {
        console.error('Failed to fetch network stats:', error)
        setStats(prev => ({ ...prev, status: 'offline' }))
      }
    }

    // Fetch immediately
    fetchStats()

    // Then fetch every 10 seconds
    const interval = setInterval(fetchStats, 10000)

    return () => clearInterval(interval)
  }, [])

  const formatBlockHeight = (height: number) => {
    return height.toLocaleString('en-US')
  }

  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
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
            <p className="text-sm text-muted-foreground leading-relaxed">
              The most comprehensive blockchain explorer for Midnight Network. Track transactions, blocks, and addresses
              in real-time.
            </p>
            <div className="flex items-center gap-3">
              
              <Link
                href="https://github.com/Tech-Expansion"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background/50 hover:bg-background transition-colors"
              >
                <Github className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
              <Link
                href="https://x.com/midnightexplr"
                className="p-2 rounded-lg bg-background/50 hover:bg-background transition-colors"
              >
                <svg
                  className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                  fill="currentColor"
                  viewBox="0 0 1200 1227"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
                </svg>
              </Link>
              {/* <Link
                href="#"
                className="p-2 rounded-lg bg-background/50 hover:bg-background transition-colors"
              >
                <svg
                  className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8245-.6527 1.2979a18.168 18.168 0 00-5.4844 0c-.2063-.4734-.4416-.9226-.6527-1.2979a.0741.0741 0 00-.0785-.0371 19.7363 19.7363 0 00-4.8851 1.5152.069.069 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8781-1.2989 1.229-2.0011a.076.076 0 00-.0416-.1057c-.63-.2446-1.2252-.534-1.7875-.8697a.0777.0777 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0743.0743 0 01.0776.0105c.1201.0991.246.1971.3718.2914a.0777.0777 0 01-.0076.1277c-.5623.3357-1.1575.6251-1.7875.8697a.076.076 0 00-.0416.1057c.3508.7022.7673 1.3707 1.229 2.0011a.0777.0777 0 00.0842.0276c1.9516-.6067 3.9401-1.5219 5.9929-3.0294a.0824.0824 0 00.0312-.0561c.4182-4.478-1.4406-9.012-5.313-13.6602a.069.069 0 00-.0321-.0277zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9744-2.4189 2.1569-2.4189 1.1966 0 2.157 1.0857 2.157 2.4189 0 1.3333-.9604 2.419-2.157 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9744-2.4189 2.1569-2.4189 1.1966 0 2.157 1.0857 2.157 2.4189 0 1.3333-.9604 2.419-2.157 2.419z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="p-2 rounded-lg bg-background/50 hover:bg-background transition-colors"
              >
                <Mail className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </Link> */}
            </div>
          </div>

          {/* Explorer Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Explorer</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blocks" className="text-sm text-muted-foreground hover:text-blue-400 transition-colors">
                  Blocks
                </Link>
              </li>
              <li>
                <Link
                  href="/transactions"
                  className="text-sm text-muted-foreground hover:text-blue-400 transition-colors"
                >
                  Transactions
                </Link>
              </li>
              <li>
                <Link href="/contracts" className="text-sm text-muted-foreground hover:text-blue-400 transition-colors">
                  Contracts
                </Link>
              </li>
              <li>
                <Link href="/pool" className="text-sm text-muted-foreground hover:text-blue-400 transition-colors">
                  Pools
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-blue-400 transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="https://x.com/midnightexplr" className="text-sm text-muted-foreground hover:text-blue-400 transition-colors">
                  Developer Docs
                </Link>
              </li>
              <li>
                <Link href="https://x.com/midnightexplr" className="text-sm text-muted-foreground hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="https://x.com/midnightexplr" className="text-sm text-muted-foreground hover:text-blue-400 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Network Stats */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Network Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Network</span>
                <span className={`flex items-center gap-1 ${
                  stats.status === 'online' ? 'text-green-400' : 'text-green-400'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${
                    stats.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-green-400 animate-pulse'
                  }`} />
                  {stats.status === 'online' ? 'Online' : 'Online'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Block Height</span>
                <span className="text-blue-400 font-mono">
                  {latestBlock ? `#${latestBlock.height}` : 'Loading'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Unofficial Midnight Explorer. Built for the Midnight Blockchain community.<br />
            © 2025 midnightexplorer.com
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
