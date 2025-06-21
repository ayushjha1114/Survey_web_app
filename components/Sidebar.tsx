'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Edit, Upload, Pencil, Menu } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

const navItems = [
  { label: 'Dashboard', icon: <Home />, href: '/dashboard' },
  { label: 'Survey Form Entry', icon: <Edit />, href: '/form' },
  { label: 'Upload CSV', icon: <Upload />, href: '/upload' },
  { label: 'Mission Form Entry', icon: <Pencil />, href: '/mission-form' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-white border-r border-gray-200 shadow-md flex flex-col ${collapsed ? 'w-16' : 'w-60'} transition-all duration-300`}>
      <div className="flex items-center justify-between p-4 text-gray-500">
        <span className={`text-xl font-bold ${collapsed ? 'hidden' : 'block'}`}>SurveyApp</span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-gray-800"
          >
            <div
              data-tooltip-id="sidebar-tooltip"
              data-tooltip-content={collapsed ? item.label : undefined}
              className="text-lg"
            >
              {item.icon}
            </div>
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
        <Tooltip id="sidebar-tooltip" place="right" />
      </nav>
    </div>
  );
}