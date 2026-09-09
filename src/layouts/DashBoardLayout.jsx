import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, List, Plus, FileText, CreditCard, Users, Bell, Menu, X,
  Coins, LogOut, Sun, Moon, Briefcase, ChevronRight, CheckCheck, Link2, User
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const DashboardLayout = ({ children }) => {
  const { user, logOut, role, coins } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";
  });

  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Theme sync
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await axiosSecure.get(`/api/notifications/${user.email}`);
      const data = res.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      // silently fail
    }
  }, [user?.email]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkRead = async () => {
    if (!user?.email) return;
    try {
      await axiosSecure.patch(`/api/notifications/read/${user.email}`);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (_) {}
  };

  const handleNotifClick = (notif) => {
    setShowNotifications(false);
    if (notif.actionRoute) navigate(notif.actionRoute);
  };

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  const getNavigationItems = () => {
    switch (role) {
      case "worker":
        return [
          { icon: Home, label: "Overview", path: "/dashboard" },
          { icon: List, label: "Task Marketplace", path: "/dashboard/task-list" },
          { icon: FileText, label: "My Submissions", path: "/dashboard/my-submission" },
          { icon: CreditCard, label: "Withdraw Earnings", path: "/dashboard/withdrawals" },
          { icon: User, label: "My Profile", path: "/dashboard/profile" },
        ];
      case "buyer":
        return [
          { icon: Home, label: "Overview", path: "/dashboard" },
          { icon: Plus, label: "Post New Task", path: "/dashboard/add-task" },
          { icon: List, label: "My Tasks & Submissions", path: "/dashboard/my-tasks" },
          { icon: Coins, label: "Purchase Coins", path: "/dashboard/purchase" },
          { icon: FileText, label: "Payment History", path: "/dashboard/payments" },
          { icon: User, label: "My Profile", path: "/dashboard/profile" },
        ];
      case "admin":
        return [
          { icon: Home, label: "Admin Overview", path: "/dashboard" },
          { icon: Users, label: "Manage All Users", path: "/dashboard/manage-users" },
          { icon: List, label: "Manage Tasks Pool", path: "/dashboard/manage-tasks" },
          { icon: User, label: "My Profile", path: "/dashboard/profile" },
        ];
      default:
        return [
          { icon: Home, label: "Overview", path: "/dashboard" },
          { icon: User, label: "My Profile", path: "/dashboard/profile" },
        ];
    }
  };

  const navigationItems = getNavigationItems();
  const displayName = user?.displayName || user?.name || "User";
  const initials = displayName
    .split(" ").filter(Boolean).slice(0, 2)
    .map((n) => n[0].toUpperCase()).join("") || "ST";
  const avatarSrc = user?.photoURL || user?.photo;

  const formatTime = (t) => {
    if (!t) return "";
    const d = new Date(t);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl lg:shadow-none transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col justify-between`}
      >
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 dark:border-slate-800">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center text-white shadow-md">
                <Coins className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Swift<span className="text-indigo-600 dark:text-indigo-400">Tasks</span>
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Card */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <Link
              to="/dashboard/profile"
              onClick={() => setIsSidebarOpen(false)}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3 hover:border-indigo-500/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group cursor-pointer"
              title="Click to view full profile"
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt={displayName} className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{displayName}</p>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    role === "admin"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                      : role === "buyer"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  }`}>{role || "Member"}</span>
                  <span className="text-[10px] text-slate-400 font-medium">View Profile</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="p-3 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>← Back to Main Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full px-3.5 py-2.5 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2.5 text-sm font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-8 z-30 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white capitalize hidden sm:block">
              {role ? `${role} Portal` : "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Coins */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 dark:bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/30">
              <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{Number(coins || 0).toLocaleString()}</span>
              <span className="text-xs text-amber-600/80 dark:text-amber-400/80 font-medium hidden sm:inline">coins</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark((p) => !p)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotifications((p) => !p); setShowProfile(false); }}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkRead}
                        className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="text-xs text-slate-500 dark:text-slate-400">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <button
                          key={i}
                          onClick={() => handleNotifClick(n)}
                          className={`w-full text-left p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex gap-3 cursor-pointer ${
                            !n.read ? "bg-indigo-50/60 dark:bg-indigo-950/20" : ""
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{formatTime(n.time)}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800" ref={profileRef}>
              <button
                onClick={() => { setShowProfile((p) => !p); setShowNotifications(false); }}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt={displayName} className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs">
                    {initials}
                  </div>
                )}
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1.5 ${
                      role === "admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                      : role === "buyer" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    }`}>{role}</span>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                    >
                      <User className="w-4 h-4 text-indigo-500" />
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <Home className="w-4 h-4 text-slate-500" />
                      Dashboard Home
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <Link2 className="w-4 h-4 text-slate-500" />
                      Main Website
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={() => { setShowProfile(false); handleLogout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 transition-colors">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        <footer className="py-3 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
          © {new Date().getFullYear()} SwiftTasks Platform. All rights reserved.
        </footer>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
