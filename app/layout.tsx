import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import './globals.css';
import { Providers } from '@/store/provider'; // 🔌 Redux Provider

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden text-gray-900 bg-gray-50">
        <Providers>
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
