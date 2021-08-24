/**here we take the user context passed to all component in order to determine whether the user is logged in or not.
 *if the user is logged in we show on the navbar ==> Home, View Car, Log out and UserName. and an option to add the car
 *if no one is logged in you show ==> Home, Log in, Register. and a message to tell the user to log in
 * **/


import React,{useContext} from "react";
import {Link} from "react-router-dom";
import UserContext from "../context/UserContext";

import "./style.css";

const NavBar = ()=>{


    const {userData, setUserData} = useContext(UserContext)

    const logout =()=>{
        setUserData({
            token: undefined,
            user: undefined,
        });

        localStorage.setItem("auth-token", "");
    };

    return <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="item navbar-brand" >Car Management</div>

        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#newMenu"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="newMenu">
            <div className="navbar-nav">

                <Link to="/" style={{ textDecoration: 'none' }}>

                    <div className="nav-item nav-link" >Home</div>

                </Link>

                {
                    userData.user ? (
                        <>
                        <Link to="/carList" style={{ textDecoration: 'none' }}>
                            <div className="nav-item nav-link" >View Cars</div>

                        </Link>
                        <Link to="" style={{ textDecoration: 'none' }}>
                            <div className="nav-item nav-link"  onClick={logout}>Log Out</div>

                        </Link>
                            <span>
                             <div className="nav-item nav-link userName" >{userData.user.displayName}</div>

                            </span>


                        </>
                    ) : (

                        <>
                        <Link to="/Login" style={{ textDecoration: 'none' }}>


                            <div className="nav-item nav-link" >Log In</div>

                        </Link>

                    <Link to="/Register" style={{ textDecoration: 'none' }}>
                    <div className="nav-item nav-link" >Register</div>

                    </Link>

                        </>
                    )
                }




            </div>
        </div>
    </nav>
}

export default NavBar;