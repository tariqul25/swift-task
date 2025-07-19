import React from 'react';
import { NavLink } from 'react-router';

const Navbar = () => {
    const links = <>
        <NavLink><li></li></NavLink>
        <NavLink><li></li></NavLink>
    </>


    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <h2 className="font-bold text-xl">SwiftTasks</h2>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">

                    </ul>
                </div>
                <div className="navbar-end">
                    <NavLink className='mr-4' to='/login'>Login</NavLink>
                    <NavLink className='mr-4' to='register'>Register</NavLink>
                    <button className="btn hover:scale-105 hidden md:block">Join As Developer</button>
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {/* {links} */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;