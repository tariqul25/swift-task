import React, { useState } from 'react';
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
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import Footer from '../pages/shared/Footer/Footer';

const DashboardLayout = ({ children }) => {
  const { user, logOut, role, coins } = useAuth();
  // console.log(user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logOut();

    navigate('/');
  };

  {/*Dashboard page sidebar routing path */ }
  const getNavigationItems = () => {
    switch (role) {
      case 'worker':
        return [
          { icon: Home, label: 'Home', path: '/dashboard' },
          { icon: List, label: 'Task List', path: '/dashboard/task-list' },
          { icon: FileText, label: 'My Submissions', path: '/dashboard/my-submission' },
          { icon: CreditCard, label: 'Withdrawals', path: '/dashboard/withdrawals' }
        ];
      case 'buyer':
        return [
          { icon: Home, label: 'Home', path: '/dashboard' },
          { icon: Plus, label: 'Add New Task', path: '/dashboard/add-task' },
          { icon: List, label: 'My Tasks', path: '/dashboard/my-tasks' },
          { icon: CreditCard, label: 'Purchase Coins', path: '/dashboard/purchase' },
          { icon: FileText, label: 'Payment History', path: '/dashboard/payments' }
        ];
      case 'admin':
        return [
          { icon: Home, label: 'Home', path: '/dashboard' },
          { icon: Users, label: 'Manage Users', path: '/dashboard/manage-users' },
          { icon: List, label: 'Manage Tasks', path: '/dashboard/manage-tasks' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="block md:hidden w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg items-center justify-center">
              <span className="text-white font-bold text-sm">MT</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Dashboard</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 py-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-800 font-medium">{coins || 0}</span>
            </div>
            <div className="flex justify-between items-center space-x-2">
              <img
                src={user?.photoURL || user?.photoUrl || user?.photo || user?.reloadUserInfo?.photoUrl || '/placeholder.svg'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>
        </div>

        <nav className="mt-4">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${location.pathname === item.path ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>


        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 hover:rounded-lg flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Left side - Logo and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Logo - visible on larger screens */}
              <Link to='/'>
                <div className=" md:hidden lg:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">ST</span>
                  </div>
                  <span className="text-xl font-bold text-gray-800">SwiftTasks</span>
                </div></Link>
            </div>

            {/* Right side - User info and notifications */}
            <div className="flex items-center space-x-4">
              {/* User coins and info */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">{coins || 0}</span>
                </div>

                <div className="h-6 w-px bg-gray-300"></div>

                <div className="flex items-center space-x-2">
                  <img
                    src={user?.photoURL || user?.photoUrl || user?.photo || user?.reloadUserInfo?.photoUrl || '/placeholder.svg'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="hidden md:block">
                    <p className="text-sm text-gray-500 capitalize">{role}</p>
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  </div>
                </div>

                <div className="h-6 w-px bg-gray-300"></div>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification, index) => (
                        <div key={index} className="px-4 py-3 hover:bg-gray-50 border-b">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>


        <div className=" p-4 bg-gary-600 border-t text-center text-black">
          <p> © {new Date().getFullYear()} SwiftTasks Platform. All rights reserved.</p>
        </div>
      </div>


      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
