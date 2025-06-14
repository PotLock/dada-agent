'use client';

import { useWalletSelector } from '@/contexts/WalletSelectorContext';
// import { useRouter } from 'next/navigation'; // No longer needed in simplified header

// const navLinks = [
//   { name: 'Explore', href: '#' },
//   { name: 'Why Funding AI', href: '#' },
//   { name: 'How It Works', href: '#' },
//   { name: 'About', href: '#' },
// ];

export default function Header() {
  const { modal, accountId } = useWalletSelector();
  // const router = useRouter(); // No longer needed

  const handleSignIn = () => {
    modal?.show();
  };

  const handleSignOut = async () => {
    const wallet = await window.selector.wallet();
    await wallet.signOut();
  };

  return (
    <header className="w-full flex justify-end px-6 py-4 fixed top-0 right-0 z-20">
      <div className="flex items-center gap-4">
        {accountId ? (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-blue-50/60 text-blue-800 px-4 py-2 rounded-full font-medium border border-blue-100 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors cursor-pointer shadow-sm"
            title="Disconnect Wallet"
          >
            <span className="text-sm">
              {accountId.substring(0, 6)}...{accountId.substring(accountId.length - 4)}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H9" /></svg>
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="bg-[#4F46E5] text-white px-6 py-3 rounded-full hover:bg-[#4338CA] transition-colors text-base font-semibold shadow-md"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
} 