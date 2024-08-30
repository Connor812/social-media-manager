import React from "react";
import Placeholder from "../assets/images/thumbnail-placeholder.png";
// icons
import { FaInstagramSquare } from "react-icons/fa"; // Instagram
import { FaFacebookSquare } from "react-icons/fa"; // Facebook
import { RiTwitterXLine } from "react-icons/ri"; // Twitter
import { FaYoutube } from "react-icons/fa"; // Youtube
import { AiFillTikTok } from "react-icons/ai"; // TikTok
import { IoIosCheckmarkCircle } from "react-icons/io"; // Checkmark
import { FaVideo } from "react-icons/fa"; // Video
import { TbLink } from "react-icons/tb"; // Link
import { IoMdImage } from "react-icons/io"; // Image

function SocialMediaCard({ day, date, month, year, id, handleShow, setSelectedDate, posts }) {
    const providedDate = new Date(`${month} ${date}, ${year}`);
    const currentDate = new Date();
    const isPast = providedDate < currentDate;
    const filteredPosts = posts.filter(post =>
        post.date === date && post.month === month && post.year === year
    );

    const numberOfPosts = filteredPosts.length;

    const handleAddPost = ({ date, month, year }) => {
        setSelectedDate({ date, month, year });
        handleShow(true);
    };

    return (
        <div id={id} className={`social-media-card ${isPast ? 'passed' : ''}`}>
            <div className="date-container">
                <div className="date-top-section">
                    <div className="date-text">
                        {day}
                    </div>
                    <div className="number-of-posts">
                        {numberOfPosts}
                    </div>
                </div>
                <div className="date-number">
                    {date}
                </div>
                <div className="add-post-btn">
                    <button onClick={() => handleAddPost({ date, month, year })}>+</button>
                </div>
            </div>
            <div className="posts">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <div key={post.id} className="post">
                            <div className="title-container">
                                {post.type === 'facebook' && <FaFacebookSquare className="social-media-icon facebook" />}
                                {post.type === 'instagram' && <FaInstagramSquare className="social-media-icon instagram" />}
                                {post.type === 'twitter' && <RiTwitterXLine className="social-media-icon twitter" />}
                                {post.type === 'youtube' && <FaYoutube className="social-media-icon youtube" />}
                                {post.type === 'tiktok' && <AiFillTikTok className="social-media-icon tiktok" />}
                                <span className="post-title">{post.title}</span>
                            </div>
                            <div className="time">
                                <strong>{post.time}</strong>
                            </div>
                            <div className="image-container">
                                <img className="post-image" src={post.thumbnail ? `http://localhost/social-media-manager/assets/${post.thumbnail}` : Placeholder} alt="thumbnail" />
                            </div>
                            <div className="post-info">
                                {post.status === "posted" ? <IoIosCheckmarkCircle className="checkmark" /> : ""}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-posts"></div>
                )}
            </div>
        </div>
    );
}

export default SocialMediaCard;
