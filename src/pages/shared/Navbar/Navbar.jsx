import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Coins, User, LogOut, Menu, X, Code } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';

const Navbar = () => {
  const { user, logOut, role, coins } = useAuth();
  console.log(user?.coins);
  //  console.log(user.accessToken);
  // console.log(user.getIdToken);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  const handleLogout = () => {
    logOut();
    navigate('/');
    setIsProfileOpen(false);
  };

  const githubUrl = "https://github.com/tariqul25";

  const commonLinks = (
    <>
      {user && (
        <li>
          <NavLink to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</NavLink>
        </li>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center rounded-lg font-bold text-sm">
              ST
            </div>
            <h1 className="font-bold text-xl text-gray-800">SwiftTasks</h1>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-6">
            {commonLinks}
            {user ? (
              <>
                <li>
                  <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
                    <Coins className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-800 font-medium">{user?.coins || 0}</span>
                  </div>
                </li>
                <li className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    <img
                      src={user?.photoURL || user?.photoUrl || user?.photo || user?.reloadUserInfo?.photoUrl || '/placeholder.svg'}
                      className="w-8 h-8 rounded-full object-cover"
                      alt="User"
                    />

                    <span>{user.name}</span>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm text-gray-500">Role: {role}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 hover:rounded-lg flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li><NavLink to="/login" className="hover:text-blue-600">Login</NavLink></li>
                <li><NavLink to="/register" className="hover:text-blue-600">Register</NavLink></li>
              </>
            )}
            <li>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
              >
                <Code className="w-4 h-4" /> Join as Developer
              </a>
            </li>
          </ul>

          {/* Mobile Toggle Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 py-2 border-t border-gray-200">
            <ul className="flex flex-col space-y-2">
              {commonLinks}
              {user ? (
                <>
                  <li className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-800 font-medium">{coins || 0} Coins</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img
                      src={user?.photoURL || user?.photoUrl || user?.photo || user?.reloadUserInfo?.photoUrl || '/placeholder.svg'}
                      className="w-6 h-6 rounded-full object-cover"
                      alt="User"
                    />
                    <span>{user?.displayName} ({user.role})</span>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-red-600 hover:text-red-700">Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li><NavLink to="/login" onClick={() => setIsMenuOpen(false)}>Login</NavLink></li>
                  <li><NavLink to="/register" onClick={() => setIsMenuOpen(false)}>Register</NavLink></li>
                </>
              )}
              <li>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  Join as Developer
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
