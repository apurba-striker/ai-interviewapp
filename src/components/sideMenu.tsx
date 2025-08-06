"use client";

import React, { useState, useEffect } from "react";
import { PlayCircleIcon, SpeechIcon, BarChart3, Settings, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

function SideMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    {
      icon: PlayCircleIcon,
      label: "Interviews",
      path: "/dashboard",
      description: "Manage your interviews"
    },
    {
      icon: SpeechIcon,
      label: "Interviewers",
      path: "/dashboard/interviewers",
      description: "Configure AI interviewers"
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: "/dashboard/analytics",
      description: "View insights & reports"
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/dashboard/settings",
      description: "Account configuration"
    }
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Don't render theme toggle until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`fixed left-0 top-16 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <h3 className={`font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 transition-opacity duration-300 ${
              isCollapsed ? 'opacity-0 sr-only' : 'opacity-100'
            }`}>
              Navigation
            </h3>
            {/* Placeholder content */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed left-0 top-16 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out z-40 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="p-4 space-y-6">
        {/* Navigation Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-opacity duration-300 ${
              isCollapsed ? 'opacity-0 sr-only' : 'opacity-100'
            }`}>
              Navigation
            </h3>
            {!isCollapsed && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </div>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || 
              (item.path === "/dashboard" && pathname.includes("/interviews"));
            
            return (
              <div
                key={item.path}
                className={`group relative rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 shadow-sm" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                }`}
                onClick={() => router.push(item.path)}
              >
                <div className="flex items-center gap-3 p-3">
                  <div className={`p-2 rounded-md transition-colors flex-shrink-0 ${
                    isActive 
                      ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm" 
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                  }`}>
                    <Icon size={isCollapsed ? 20 : 18} />
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm transition-colors truncate ${
                        isActive ? "text-indigo-700 dark:text-indigo-300" : "text-gray-900 dark:text-gray-100"
                      }`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Quick Stats Section */}
        {!isCollapsed && (
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 text-xs">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Interviews</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">12</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Responses</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">1,247</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Theme Toggle */}
        {isCollapsed && (
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideMenu;
