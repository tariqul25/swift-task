import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Dashboard from "../pages/Dashboard/DashBoard";
import RoleBasedDashboard from "../pages/Dashboard/RoleBasedDashboard/RoleBasedDashboard";
import ManageTasks from "../pages/Dashboard/AdminDashBoard/ManageTasks";
import MangeUsers from "../pages/Dashboard/AdminDashBoard/MangeUsers";
import MySubmissions from "../pages/Dashboard/WorkerDashBoard/MySubmissions";
import TaskList from "../pages/Dashboard/WorkerDashBoard/TaskList";
import Withdrawals from "../pages/Dashboard/WorkerDashBoard/Withdrwals";
import AddNewTask from "../pages/Dashboard/BuyerDashBoard/AddNewTask";
import MyTasks from "../pages/Dashboard/BuyerDashBoard/MyTasks";
import PurchaseCoins from "../pages/Dashboard/BuyerDashBoard/PurchaseCoins";
import PaymentHistory from "../pages/Dashboard/BuyerDashBoard/PaymentHistory";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> }
    ]
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> }
    ]
  },
  {
    path: "/dashboard",
    element: (
        <Dashboard />
    ),
    children: [
      { index: true, element: <RoleBasedDashboard/> },

      { path: "add-task", element: <AddNewTask /> },
      { path: "my-tasks", element: <MyTasks /> },
      { path: "purchase", element: <PurchaseCoins /> },
      { path: "payments", element: <PaymentHistory /> },

      { path: "manage-tasks", element: <ManageTasks /> },
      { path: "manage-users", element: <MangeUsers /> },
      { path: "payments", element: <PaymentHistory /> },

      { path: "my-submission", element: <MySubmissions /> },
      { path: "task-list", element: <TaskList /> },
      { path: "withdrawals", element: <Withdrawals /> }
    ]
  }
]);
