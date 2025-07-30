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
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import PrivateRoute from "../routes/PrivateRoute";


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
      <PrivateRoute><Dashboard /></PrivateRoute>
    ),
    children: [
      { index: true, element: <RoleBasedDashboard /> },

      { path: "add-task", element: <PrivateRoute><AddNewTask /></PrivateRoute> },
      { path: "my-tasks", element: <PrivateRoute><MyTasks /></PrivateRoute> },
      { path: "purchase", element: <PrivateRoute><PurchaseCoins /></PrivateRoute> },
      { path: "payments", element: <PrivateRoute><PaymentHistory /></PrivateRoute> },

      { path: "manage-tasks", element:  <PrivateRoute><ManageTasks /></PrivateRoute> },
      { path: "manage-users", element:  <PrivateRoute><MangeUsers /></PrivateRoute> },
      { path: "payments", element:  <PrivateRoute><PaymentHistory /></PrivateRoute> },

      { path: "my-submission", element:  <PrivateRoute><MySubmissions /></PrivateRoute> },
      { path: "task-list", element:  <PrivateRoute><TaskList /></PrivateRoute> },
      { path: "withdrawals", element:  <PrivateRoute><Withdrawals /></PrivateRoute> }
    ]
  },
  {
    path: "*",
    element: <ErrorPage />
  }
]);
