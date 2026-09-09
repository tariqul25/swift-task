import React, { useState, useEffect } from 'react';
import {
  Home,
  List,
  Plus,
  FileText,
  CreditCard,
  Users,
  Settings,
  Bell,
  Menu,
  X,
  Coins,
  LogOut,
  Sun,
  Moon,
  ShieldAlert,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';

const DashboardLayout = ({ children }) => {
  const { user, logOut, role, coins } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark';
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const getNavigationItems = () => {
    switch (role) {
      case 'worker':
        return [
          { icon: Home, label: 'Overview', path: '/dashboard' },
          { icon: List, label: 'Task Marketplace', path: '/dashboard/task-list' },
          { icon: FileText, label: 'My Submissions', path: '/dashboard/my-submission' },
          { icon: CreditCard, label: 'Withdraw Earnings', path: '/dashboard/withdrawals' }
        ];
      case 'buyer':
        return [
          { icon: Home, label: 'Overview', path: '/dashboard' },
          { icon: Plus, label: 'Post New Task', path: '/dashboard/add-task' },
          { icon: List, label: 'My Tasks & Submissions', path: '/dashboard/my-tasks' },
          { icon: Coins, label: 'Purchase Coins', path: '/dashboard/purchase' },
          { icon: FileText, label: 'Payment History', path: '/dashboard/payments' }
        ];
      case 'admin':
        return [
          { icon: Home, label: 'Admin Overview', path: '/dashboard' },
          { icon: Users, label: 'Manage All Users', path: '/dashboard/manage-users' },
          { icon: List, label: 'Manage Tasks Pool', path: '/dashboard/manage-tasks' }
        ];
      default:
        return [
          { icon: Home, label: 'Overview', path: '/dashboard' }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  const userInitial = (user?.displayName || user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl lg:shadow-none transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col justify-between`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 dark:border-slate-800">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
                <Coins className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Swift<span className="text-primary">Tasks</span>
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
              {user?.photoURL || user?.photo ? (
                <img
                  src={user.photoURL || user.photo}
                  alt={user?.displayName || user?.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/20"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {userInitial}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {user?.displayName || user?.name || 'User'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    role === 'admin'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                      : role === 'buyer'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}>
                    {role || 'Member'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Links */}
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
                      ? 'bg-primary text-white shadow-md shadow-primary/20 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
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

        {/* Bottom Actions */}
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
        {/* Top Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-8 z-30 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white capitalize hidden sm:block">
              {role ? `${role} Portal` : 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Coins Balance Pill */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 dark:from-amber-500/20 dark:to-yellow-500/20 px-3.5 py-1.5 rounded-full border border-amber-500/30">
              <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                {Number(coins || 0).toLocaleString()}
              </span>
              <span className="text-xs text-amber-600/80 dark:text-amber-400/80 font-medium hidden sm:inline">
                coins
              </span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h3>
                    <span className="text-xs text-slate-400">Live</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-slate-500">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((n, i) => (
                      <div key={i} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors">
                        <p className="text-xs text-slate-900 dark:text-slate-100">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User Dropdown Preview */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              {user?.photoURL || user?.photo ? (
                <img
                  src={user.photoURL || user.photo}
                  alt={user?.displayName || user?.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {userInitial}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 transition-colors">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-3 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
          © {new Date().getFullYear()} SwiftTasks Platform. All rights reserved.
        </footer>
      </div>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
