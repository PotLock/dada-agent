import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletSelectorProvider } from '@/contexts/WalletSelectorContext'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })
import "@near-wallet-selector/modal-ui/styles.css";

export const metadata: Metadata = {
  title: 'Funding AI',
  description: 'A fully autonomous NEAR-powered donation agent that donates $1/day to Potlock campaigns based on user preferences.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <WalletSelectorProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
        </WalletSelectorProvider>
      </body>
    </html>
  )
} 