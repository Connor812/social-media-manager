import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../dataContext/dataContext";
import { IoMdImage } from "react-icons/io";

function Header() {

    const { isLoggedIn, logout } = useContext(DataContext);

    return (
        <nav>
            <div className="nav-top">
                <div className="nav-title">
                    <IoMdImage className="nav-icon" />
                    <h2>
                        Social Media Manger
                    </h2>
                </div>
                <div>
                    {isLoggedIn ? <button className="logout-btn" onClick={logout}>Logout</button> : <Link className="logout-btn" to="/login">Login</Link>}
                </div>
            </div>
            <div>
                <ul className="nav-links">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {isLoggedIn ?
                        <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        : null}
                </ul>
            </div>
        </nav>
    );
}

export default Header;
