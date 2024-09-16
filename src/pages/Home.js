import React from "react";
import { Link } from "react-router-dom";
import DashboardImg from "../assets/images/home-page.png";
import "../assets/css/home.css";

function Home() {
    return (
        <main className="home-page">

            <section className="content-wrapper">
                <h1 className="text-start mb-5">
                    Welcome To The Social Media Manager
                </h1>
                <div className="d-flex gap-5">
                    <img src={DashboardImg} className="dashboard-img" alt="The Social Media Manger Dashboard" />
                    <div>

                        <p>"Social Media Manager" is an app designed to streamline the process of managing social media posts through an intuitive calendar interface. With this tool, users can easily plan, schedule, and organize their social media content across various platforms. The calendar view provides a clear overview of upcoming posts, allowing for efficient management of content strategy. Whether you’re handling posts for a single platform or managing multiple accounts, "Social Media Manager" simplifies the process, ensuring that your social media presence remains consistent and effective.</p>
                        <Link to="/signup" className="signup-btn">
                            Signup
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;
