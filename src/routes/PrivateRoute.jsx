import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import Loading from '../Loading';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = use(AuthContext)
    const location = useLocation()

    if (loading) return <Loading></Loading>

    if (user) return children

    return (
        <Navigate state={location.pathname} to='/login'></Navigate>
    );
};

export default PrivateRoute;