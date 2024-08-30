import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "swiper/swiper-bundle.css";
import '../assets/css/dashboard.css';
import SocialMediaCard from "../components/SocialMediaCard";
import { FaRegCalendar } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { BsArrowRightSquareFill, BsArrowLeftSquareFill } from "react-icons/bs";
import { Modal, Spinner } from "react-bootstrap";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { BiSolidRightArrow } from "react-icons/bi";

function Home() {
    const navigate = useNavigate();
    const calendarContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [days, setDays] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userId = userData?.id;

    useEffect(() => {
        generateDays(currentDate.getFullYear(), currentDate.getMonth());
        fetchPostsForMonth(currentDate.getFullYear(), currentDate.getMonth());
    }, [currentDate]);

    const generateDays = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long' });
        const newDays = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            newDays.push({
                dayName,
                dateNumber: i,
                month: monthName,
                id: `day-${i}`,
                year: year
            });
        }

        setDays(newDays);
    };

    const fetchPostsForMonth = async (year, month) => {
        const apiUrl = "http://localhost/social-media-manager/api/get-posts.php";
        const monthText = new Date(year, month).toLocaleDateString('en-US', { month: 'long' });
        setLoading(true);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("userData")
                },
                body: JSON.stringify({
                    "user_id": userId,
                    "year": year,
                    "month": monthText
                })
            });
            const posts = await response.json();
            if (!posts.status) {
                setPosts([]);
            } else {
                setPosts(posts.data);
            }
        } catch (error) {
            console.error('Error fetching posts: ', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - calendarContainerRef.current.offsetLeft);
        setScrollLeft(calendarContainerRef.current.scrollLeft);
        document.body.style.userSelect = 'none';
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        document.body.style.userSelect = '';
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.userSelect = '';
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - calendarContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1;
        calendarContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handlePrevMonth = () => {
        const prevMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        setCurrentDate(prevMonth);
        scrollToBeginning();
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        setCurrentDate(nextMonth);
        scrollToBeginning();
    };

    const scrollToBeginning = () => {
        calendarContainerRef.current.scrollLeft = 0;
    };

    const scrollToSpecificDay = (date) => {
        const dayElement = document.getElementById(`day-${date.getDate()}`);
        if (dayElement) {
            calendarContainerRef.current.scrollTo({
                left: dayElement.offsetLeft - calendarContainerRef.current.offsetLeft,
                behavior: 'smooth'
            });
        }
    };

    const handleToday = () => {
        const today = new Date();
        const isSameMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

        if (!isSameMonth) {
            setCurrentDate(today);
        } else {
            scrollToSpecificDay(today);
        }

        // Delay scrolling to the specific day after the date is updated
        setTimeout(() => {
            scrollToSpecificDay(today);
        }, 100);
    };



    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        setCurrentDate(selectedDate);
        scrollToSpecificDay(selectedDate);
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSelectPlatform = (platform) => {
        const { date, month, year } = selectedDate;
        navigate(`/post/${date}/${month}/${year}/${platform}`);
    };

    return (
        <main>
            <div className="action-btn-container">
                <Link className="back-link" to="/calendar">
                    <IoIosArrowBack className="back-arrow" />
                    <FaRegCalendar className="calendar-icon" />
                </Link>
                |
                <div className="month-container">
                    <BsArrowLeftSquareFill className="month-arrows" onClick={handlePrevMonth} />
                    <div className="month-text">
                        {currentDate.toLocaleDateString('en-US', { month: 'long' })} {currentDate.getFullYear()}
                    </div>
                    <BsArrowRightSquareFill className="month-arrows" onClick={handleNextMonth} />
                </div>
                |
                <div>
                    <button className="today-btn" onClick={handleToday}>Today</button>
                </div>
                |
                <div className="">
                    <input type="date" className="select-date" onChange={handleDateChange} />
                </div>
            </div>
            <section
                className="calendar-container"
                ref={calendarContainerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                {loading ? (
                    <div className="loading">
                        <Spinner></Spinner>
                    </div>
                ) : (
                    days.map((day) => (
                        <SocialMediaCard
                            key={day.id}
                            day={day.dayName}
                            date={day.dateNumber}
                            month={day.month}
                            year={currentDate.getFullYear()}
                            id={day.id}
                            handleShow={handleShow}
                            setSelectedDate={setSelectedDate}
                            posts={posts}
                        />
                    ))
                )}
            </section>
            <Modal show={show} onHide={() => handleClose()} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Choose A Platform</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="select-platform-btn-container">
                        <button className="select-platform-btn youtube" onClick={() => handleSelectPlatform("youtube")}>
                            <BiSolidRightArrow className="icon youtube" />
                        </button>
                        <button className="select-platform-btn instagram" onClick={() => handleSelectPlatform("instagram")}>
                            <FaInstagram className="icon instagram" />
                        </button>
                        <button className="select-platform-btn facebook" onClick={() => handleSelectPlatform("facebook")}>
                            <FaFacebookF className="icon facebook" />
                        </button>
                        <button className="select-platform-btn twitter" onClick={() => handleSelectPlatform("twitter")}>
                            <RiTwitterXLine className="icon twitter" />
                        </button>
                        <button className="select-platform-btn tiktok" onClick={() => handleSelectPlatform("tiktok")}>
                            <FaTiktok className="icon tiktok" />
                        </button>
                    </div>
                </Modal.Body>
                <Modal.Footer />
            </Modal>
        </main>
    );
}

export default Home;
