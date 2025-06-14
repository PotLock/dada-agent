'use client';

import { useRouter } from 'next/navigation';

const navLinks = [
  { name: 'Home', href: '/' },
  // { name: 'Why Funding AI', href: '#' },
  { name: 'How It Works', href: '#' },
  { name: 'About', href: '#' },
];

export default function Footer() {
  // const router = useRouter(); // No longer needed as logo button is removed

  return (
    <footer className="w-full flex justify-center px-6 py-6 bg-gradient-to-r from-[#e7eaff] to-[#f3f9fa] z-10 border-t border-blue-100 mt-auto">
      {/* Removed logo button */}
      <nav className="flex flex-wrap justify-center gap-6 text-base font-medium text-blue-700">
        {navLinks.map(link => (
          <a key={link.name} href={link.href} className="hover:text-blue-900 transition-colors">{link.name}</a>
        ))}
      </nav>
    </footer>
  );
} 