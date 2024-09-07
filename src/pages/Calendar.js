import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/calendar.css";

// Days in each month
const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate(); // Month + 1 and date 0 gives us the last day of the previous month
};

// Array of month names
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Days of the week (first letter)
const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

function Calendar() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Change year
    const handleYearChange = (increment) => {
        setCurrentYear((prevYear) => prevYear + increment);
    };

    // Function to get the starting day of the month (0 for Sunday, 1 for Monday, etc.)
    const getStartDay = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    return (
        <div>
            {/* Year selector */}
            <header style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
                <button onClick={() => handleYearChange(-1)}>&lt; Previous Year</button>
                <h2>{currentYear}</h2>
                <button onClick={() => handleYearChange(1)}>Next Year &gt;</button>
            </header>

            {/* Scrollable calendar */}
            <div className="all-months-container">

                {months.map((month, monthIndex) => (
                    <div key={monthIndex} className="calendar-month-container">
                        <h3 className="m-0">{month} {currentYear}</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>
                            {/* Days of the week */}
                            {daysOfWeek.map((day, index) => (
                                <div
                                    key={index}
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        padding: "10px",
                                        borderBottom: "2px solid #ccc"
                                    }}
                                >
                                    {day}
                                </div>
                            ))}

                            {/* Blank cells for days before the start of the month */}
                            {Array.from({ length: getStartDay(monthIndex, currentYear) }, (_, index) => (
                                <div key={index}></div>
                            ))}

                            {/* Days of the month */}
                            {Array.from({ length: daysInMonth(monthIndex, currentYear) }, (_, day) => (
                                <Link
                                    to={`/dashboard/${day + 1}/${monthIndex + 1}/${currentYear}`}
                                    key={day}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ccc",
                                        textAlign: "center"
                                    }}
                                    className="day-of-week"
                                >
                                    {day + 1}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Calendar;
