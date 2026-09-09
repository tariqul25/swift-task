import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { Coins, LogOut, Menu, X, Code, Sun, Moon, LayoutDashboard, ChevronDown, Sparkles, Shield, User as UserIcon } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';

const Navbar = () => {
  const { user, logOut, role, coins } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
      setIsProfileOpen(false);
      setIsMenuOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const displayName = user?.name || user?.displayName || 'Tariqul Islam';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'ST';

  const avatarUrl = user?.photoURL || user?.photoUrl || user?.photo;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-[1570px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Swift<span className="text-indigo-600 dark:text-indigo-400">Tasks</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-widest hidden sm:inline-block">
                  Pro
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 tracking-wider uppercase">
                Workforce Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`
              }
            >
              Home
            </NavLink>

            {user && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </NavLink>
            )}

            <a
              href="https://github.com/tariqul25"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 transition-colors"
            >
              <Code className="w-3.5 h-3.5 text-indigo-500" />
              Developer
            </a>
          </div>

          {/* Desktop Right Area */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200/60 dark:border-slate-800 transition-colors"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3.5">
                {/* Live Coins Pill */}
                {role !== 'admin' && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 shadow-sm">
                    <Coins className="w-4 h-4 text-amber-500 animate-bounce" />
                    <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 tracking-tight">
                      {(coins || user?.coins || 0).toLocaleString()} <span className="font-semibold text-[10px]">COINS</span>
                    </span>
                  </div>
                )}

                {/* Profile Pill & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-all duration-200 focus:outline-none"
                  >
                    {avatarUrl && !imageError ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        onError={() => setImageError(true)}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        {initials}
                      </div>
                    )}

                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[110px] truncate leading-tight">
                        {displayName}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 capitalize leading-none mt-0.5">
                        {role || 'member'}
                      </span>
                    </div>

                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-950/20 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Signed in as</p>
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{user?.email}</p>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                          <Shield className="w-3 h-3 text-indigo-500" />
                          Role: {role}
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-indigo-500" />
                          My Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                          Dashboard Center
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions & Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Open Navigation Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-2">
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Home
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/dashboard/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  My Profile
                </NavLink>
              </>
            )}

            <a
              href="https://github.com/tariqul25"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-2"
            >
              <Code className="w-4 h-4 text-indigo-500" />
              Developer Portfolio
            </a>
          </div>

          {user ? (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{displayName}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{role}</p>
                  </div>
                </div>

                {role !== 'admin' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span>{(coins || user?.coins || 0).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="py-2.5 text-center text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="py-2.5 text-center text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
