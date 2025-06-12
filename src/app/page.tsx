'use client';

import { useWalletSelector } from '@/contexts/WalletSelectorContext';

export default function Home() {
  const { modal, accountId } = useWalletSelector();

  const handleSignIn = () => {
    modal?.show();
  };

  const handleSignOut = async () => {
    const wallet = await window.selector.wallet();
    await wallet.signOut();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">🧠 Dollar-A-Day Donation Agent (DADA)</h1>
        <p className="text-xl text-gray-600">
          A fully autonomous NEAR-powered donation agent that donates $1/day to Potlock campaigns based on user preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">🎯 Campaign Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Categories</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option>Health</option>
                <option>Education</option>
                <option>Climate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Funding Range</label>
              <div className="flex gap-4">
                <input type="number" placeholder="Min" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                <input type="number" placeholder="Max" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">📊 Donation History</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="font-medium">Campaign Name</p>
              <p className="text-sm text-gray-600">Date: 2024-02-20</p>
              <p className="text-sm text-gray-600">Amount: $1.00</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 text-center">
        {accountId ? (
          <div className="space-y-4">
            <p className="text-lg">Connected as: {accountId}</p>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
} 