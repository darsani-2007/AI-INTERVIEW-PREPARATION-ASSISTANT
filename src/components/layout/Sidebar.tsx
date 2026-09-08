import React from "react";
import {
  Home,
  User,
  FileText,
  Bot,
  HelpCircle,
  BarChart3,
  ListTodo,
  Settings,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

export type NavigationTab =
  | "dashboard"
  | "profile"
  | "resume"
  | "interview"
  | "practice"
  | "performance"
  | "plan"
  | "settings";

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onLogoutClick: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogoutClick,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { id: "profile", label: "My Profile", icon: <User className="w-4 h-4" /> },
    { id: "resume", label: "Resume Analysis", icon: <FileText className="w-4 h-4" /> },
    { id: "interview", label: "AI Mock Interview", icon: <Bot className="w-4 h-4" />, badge: "AI" },
    { id: "practice", label: "Practice Questions", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "performance", label: "Performance", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "plan", label: "Improvement Plan", icon: <ListTodo className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const handleItemClick = (id: NavigationTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const content = (
    <div className="h-full flex flex-col justify-between bg-[#0F172A] border-r border-slate-800 text-slate-300 select-none">
      <div>
        {/* Brand */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm text-sm">
              AI
            </div>
            <div>
              <span className="font-bold text-white text-base sm:text-lg tracking-tight block">
                PrepMaster
              </span>
              <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider block -mt-1">
                Interview AI
              </span>
            </div>
          </div>
          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`${
                      isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white tracking-wide">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          id="nav-logout-btn"
          onClick={() => {
            onCloseMobile();
            onLogoutClick();
          }}
          className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-all"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
