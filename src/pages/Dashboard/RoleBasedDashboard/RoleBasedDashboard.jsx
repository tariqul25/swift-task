import React from 'react';
import useAuth from '../../../hooks/useAuth';
import WorkerHome from '../WorkerDashBoard/WorkerHome';
import BuyerHome from '../BuyerDashBoard/BuyerHome';
import AdminHome from '../AdminDashBoard/AdminHome';


const RoleBasedDashboard = () => {
  const { role } = useAuth();
  console.log(role);

  if (role === 'worker') return <WorkerHome />;
  if (role === 'buyer') return <BuyerHome />;
  if (role === 'admin') return <AdminHome />;

};

export default RoleBasedDashboard;
