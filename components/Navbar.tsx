'use client';
import { LogIn } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="flex justify-end items-center px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
      <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
        <LogIn className="w-5 h-5" />
        <span>Login</span>
      </button>
    </header>
  );
}