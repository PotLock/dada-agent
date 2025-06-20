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
    <header className="w-full flex justify-end px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 fixed top-0 right-0 z-20">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {accountId ? (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 sm:gap-2 bg-gray-800/90 backdrop-blur-md text-white px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-full font-medium border border-gray-600/50 hover:bg-red-900/30 hover:border-red-400 hover:text-red-200 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl active:scale-95 min-h-[44px] sm:min-h-[48px]"
            title="Disconnect Wallet"
          >
            <span className="text-xs sm:text-sm md:text-base font-medium truncate max-w-[60px] sm:max-w-[80px] md:max-w-none">
              {accountId.substring(0, 3)}...{accountId.substring(accountId.length - 3)}
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="2" 
              stroke="currentColor" 
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H9" 
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="bg-indigo-600 text-white px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3.5 rounded-full hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl active:shadow-inner transform hover:scale-105 active:scale-95 min-h-[44px] sm:min-h-[48px] flex items-center justify-center"
          >
            <span className="hidden md:inline">Connect Wallet</span>
            <span className="hidden sm:inline md:hidden">Connect</span>
            <span className="sm:hidden">Connect</span>
          </button>
        )}
      </div>
    </header>
  );
} 