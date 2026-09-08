import React, { useState } from "react";
import { User, Profile } from "../../types";
import { Menu, Bell, Flame, ChevronDown, User as UserIcon, LogOut, Settings } from "lucide-react";

interface HeaderProps {
  user: User | null;
  profile: Profile | null;
  streakDays?: number;
  onOpenMobileNav: () => void;
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
  onLogoutClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  profile,
  streakDays = 4,
  onOpenMobileNav,
  onNavigateToProfile,
  onNavigateToSettings,
  onLogoutClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const displayName = profile?.fullName || user?.fullName || "Student";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  const subline = profile?.degree && profile?.jobRole ? `${profile.degree} • ${profile.jobRole}` : (profile?.jobRole || profile?.degree || "Student");

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-xl font-bold text-slate-900 leading-tight">
            {getGreeting()}, {displayName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 hidden sm:block mt-0.5">
            Ready to improve your interview skills today?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Streak Pill */}
        <div
          id="header-streak-pill"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold shadow-2xs"
          title={`${streakDays} Day Practice Streak!`}
        >
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>{streakDays} Days</span>
        </div>

        {/* Notification Bell */}
        <div
          className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </div>

        {/* User profile dropdown */}
        <div className="relative pl-2 sm:pl-4 border-l border-slate-200">
          <button
            id="user-profile-menu-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{displayName}</p>
              <p className="text-xs text-slate-500">{subline}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
              {initials}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-30 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onNavigateToProfile();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onNavigateToSettings();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Settings
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  id="dropdown-logout-btn"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogoutClick();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
