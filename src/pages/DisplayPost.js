import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Modal, Button, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Spinner } from "react-bootstrap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Placeholder from "../assets/images/instagram-placeholder.png";
import { PostData } from "../utils/PostData";
import "../assets/css/display-post.css";

import { IoMdCheckmark } from "react-icons/io";
import { FaCopy } from "react-icons/fa";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";
import { BiSolidRightArrow } from "react-icons/bi";
import { RiTwitterXLine } from "react-icons/ri";


function DisplayPost() {
    const { post } = useParams();
    const [hashtags, setHashtags] = useState([]);
    const [urls, setUrls] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [displayError, setDisplayError] = useState('');
    const [success, setSuccess] = useState('');
    const [postData, setPostData] = useState(null);
    const [postedPlatforms, setPostedPlatforms] = useState([]);
    const note = useRef(null);
    const [noteSaveBtn, setNoteSaveBtn] = useState("Save");

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



    useEffect(() => {
        // Fetch post data
        PostData('get-post.php', { post }, sessionStorage.getItem('userData'))
            .then((result) => {
                if (!result.status) {
                    setError(result.message);
                    setLoading(false);
                    return;
                }

                const data = result.data;
                setPostData(data);

                // Fetch related files, hashtags, and URLs if present
                if (data.files) {
                    PostData('get-files.php', { files: data.files }, sessionStorage.getItem('userData'))
                        .then((filesResult) => {
                            if (filesResult.status) {
                                setFiles(filesResult.data);
                            } else {
                                setError(filesResult.message);
                            }
                        });
                }

                if (data.hashtags) {
                    PostData('get-hashtags.php', { hashtags: data.hashtags }, sessionStorage.getItem('userData'))
                        .then((hashtagResult) => {
                            if (hashtagResult.status) {
                                setHashtags(hashtagResult.data || []); // Handle empty array
                            } else {
                                setError(hashtagResult.message);
                            }
                        });
                }

                if (data.urls) {
                    PostData('get-urls.php', { urls: data.urls }, sessionStorage.getItem('userData'))
                        .then((urlsResult) => {
                            if (urlsResult.status) {
                                setUrls(urlsResult.data || []); // Handle empty array
                            } else {
                                setError(urlsResult.message);
                            }
                        });
                }

                if (data.platforms_posted === null) {
                    setPostedPlatforms([]);
                    setLoading(false);
                    return;
                } else {
                    const postedPlatforms = data.platforms_posted.split(',');
                    setPostedPlatforms(postedPlatforms);
                    console.log(postedPlatforms);
                    setLoading(false);
                }


            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [post]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Text copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    const copyAllHashtags = () => {
        const hashtagsText = hashtags.map(hashtag => `${hashtag.hashtag}`).join(' ');
        copyToClipboard(hashtagsText);
    };

    const markAsPosted = (id, status, platform) => {

        if (postedPlatforms.includes(platform)) {
            setSuccess('');
            setDisplayError("Post already marked as posted on this platform");
            return;
        }

        PostData('mark-as-posted.php', { "id": id, "platform": platform }, sessionStorage.getItem('userData'))
            .then((result) => {
                if (result.status) {
                    setPostedPlatforms(result.platforms_posted.split(','));
                    setDisplayError('');
                    setSuccess(`Post marked as posted on ${platform}`);
                } else {
                    setSuccess('');
                    setDisplayError(result.message);
                }
            })
            .catch((error) => {
                setSuccess('');
                setDisplayError(error.message);
            });
    }

    const handleSavingNote = () => {
        if (note.current.value === '') {
            setDisplayError('Note cannot be empty');
            return;
        }

        if (noteSaveBtn === "Save") {
            setNoteSaveBtn("Saving...");
            PostData('save-note.php', { "id": postData.id, "note": note.current.value }, sessionStorage.getItem('userData'))
                .then((result) => {
                    if (result.status) {
                        setDisplayError('');
                        setSuccess('Note saved successfully');
                        setNoteSaveBtn(<IoMdCheckmark />);
                        setTimeout(() => {
                            setNoteSaveBtn("Save");
                        }, 5000);
                    } else {
                        setSuccess('');
                        setDisplayError(result.message);
                        setNoteSaveBtn("Save");
                    }
                })
                .catch((error) => {
                    setSuccess('');
                    setDisplayError(error.message);
                    setNoteSaveBtn("Save");
                });
        }
    }

    if (loading) {
        return (
            <main className="d-flex align-items-center justify-content-center">
                <Spinner></Spinner>
            </main>
        );
    }

    if (error) {
        return (
            <main className="d-flex align-items-center justify-content-center">
                <Alert variant="danger">{error}</Alert>
            </main>
        );
    }

    return (
        <main className="p-3">
            <div className="post-form">
                <div className="d-flex justify-content-between">
                    <Link className="back-btn" to={`/dashboard/${postData.date}/${(months.findIndex(month => month === postData.month)) + 1}/${postData.year}`}>Back</Link>
                </div>
                {displayError && <Alert className="m-0 mt-2 text-center" variant="danger">{displayError}</Alert>}
                {success && <Alert className="m-0 mt-2 text-center" variant="success">{success}</Alert>}
                <h1 className="mt-3">{postData ? postData.title : 'No title available'}</h1>
                <div className="d-flex gap-3 flex-wrap">
                </div>
                <hr />
                <label className="mb-2" htmlFor="description">Post Description
                    <button className="copy-btn" onClick={() => copyToClipboard(postData.description)} variant="primary">
                        <FaCopy />
                    </button>
                </label>
                <div className="description-container">
                    <p className="display-post-description">{postData.description}</p>
                </div>
                <label htmlFor="hashtags">Hashtags
                    <button onClick={copyAllHashtags} variant="primary" className="copy-hashtag-btn">
                        <FaCopy className="copy-hashtag-btn" />
                    </button>
                </label>
                <div className="display-hashtag-list">

                    {hashtags.length > 0 ? (
                        hashtags.map((hashtag, index) => (
                            <span key={index} className="hashtag">
                                {hashtag.hashtag}
                            </span>
                        ))
                    ) : (
                        <p>No hashtags available</p>
                    )}
                </div>

                <label htmlFor="urls">URLs</label>
                <div className="url-list">
                    {urls.length > 0 ? (
                        urls.map((url, index) => (
                            <span key={index} className="url">
                                <a href={url.url} target="_blank" rel="noopener noreferrer">{url.url}</a>
                            </span>
                        ))
                    ) : (
                        <p>No URLs available</p>
                    )}
                </div>

                <label className="mb-2 fs-4" htmlFor="description">Media Preview</label>


                <Row className="p-4">
                    <Col className="p-2" sm={12} md={6}>
                        <div className="post-card-container">
                            <div className="post-header">
                                <label htmlFor="thumbnail">
                                    Upload Thumbnail (Image / Video)
                                </label>
                            </div>
                            <div className="w-100 d-flex justify-content-evenly position-relative">
                                <div className="display-instagram-uploads thumbnail">
                                    {postData.thumbnail ? (
                                        <div>
                                            {postData.thumbnail.toLowerCase().endsWith(".jpg") ||
                                                postData.thumbnail.toLowerCase().endsWith(".png") ||
                                                postData.thumbnail.toLowerCase().endsWith(".jpeg") ? (
                                                <img src={`https://localhost/social-media-manager/assets/${postData.thumbnail}`} alt={postData.thumbnail} />
                                            ) : postData.thumbnail.toLowerCase().endsWith(".mp4") ||
                                                postData.thumbnail.toLowerCase().endsWith(".mov") ||
                                                postData.thumbnail.toLowerCase().endsWith(".avi") ? (
                                                <video controls>
                                                    <source src={`https://localhost/social-media-manager/assets/${postData.thumbnail}`} type={postData.thumbnail.type} />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <p>Unsupported media type</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <img src={Placeholder} alt="placeholder" />
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="p-2" sm={12} md={6}>
                        <div className="post-card-container">
                            <div className="post-header">
                                <label htmlFor="thumbnail">
                                    Upload Media (Image / Video)
                                </label>
                            </div>
                            <div className="w-100 d-flex justify-content-evenly position-relative">
                                <Swiper
                                    className="mySwiper display-instagram-uploads"
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    slidesPerView={1}
                                >
                                    {files && files.length > 0 ? (
                                        files.map((file, index) => (
                                            <SwiperSlide key={index} className="instagram-slide">
                                                {file.name.toLowerCase().endsWith(".jpg") ||
                                                    file.name.toLowerCase().endsWith(".png") ||
                                                    file.name.toLowerCase().endsWith(".jpeg") ? (
                                                    <img src={`https://localhost/social-media-manager/assets/${file.name}`} alt={file.name} />
                                                ) : file.name.toLowerCase().endsWith(".mov") ||
                                                    file.name.toLowerCase().endsWith(".mp4") ||
                                                    file.name.toLowerCase().endsWith(".avi") ? (
                                                    <video controls>
                                                        <source src={`https://localhost/social-media-manager/assets/${file.name}`} type={`video/${file.name.split('.').pop().toLowerCase()}`} />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    <p>Unsupported media type</p>
                                                )}
                                            </SwiperSlide>
                                        ))
                                    ) : (
                                        <SwiperSlide>
                                            <img src={Placeholder} alt="Placeholder" />
                                        </SwiperSlide>
                                    )}

                                </Swiper>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="p-4 pt-0">
                    <Col className="p-2" sm={12} md={6}>
                        <div className="post-card-container">
                            <div className="post-header">
                                <label htmlFor="thumbnail">
                                    Platforms To Post
                                </label>
                            </div>
                            <div className="display-select-platform-btn-container">
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://www.youtube.com/upload"
                                    className={`display-select-platform-btn youtube ${postedPlatforms.includes('youtube') ? 'post-posted' : ''}`}
                                    onClick={() => markAsPosted(postData.id, postData.status, "youtube")}>
                                    <BiSolidRightArrow className="icon youtube" />
                                </a>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://www.instagram.com/"
                                    className={`display-select-platform-btn instagram ${postedPlatforms.includes('instagram') ? 'post-posted' : ''}`}
                                    onClick={() => markAsPosted(postData.id, postData.status, "instagram")}>
                                    <FaInstagram className="icon instagram" />
                                </a>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://www.facebook.com/profile.php"
                                    className={`display-select-platform-btn facebook ${postedPlatforms.includes('facebook') ? 'post-posted' : ''}`}
                                    onClick={() => markAsPosted(postData.id, postData.status, "facebook")}>
                                    <FaFacebookF className="icon facebook" />
                                </a>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://x.com/home"
                                    className={`display-select-platform-btn twitter ${postedPlatforms.includes('twitter') ? 'post-posted' : ''}`}
                                    onClick={() => markAsPosted(postData.id, postData.status, "twitter")}>
                                    <RiTwitterXLine className="icon twitter" />
                                </a>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://www.tiktok.com/tiktokstudio/upload"
                                    className={`display-select-platform-btn tiktok ${postedPlatforms.includes('tiktok') ? 'post-posted' : ''}`}
                                    onClick={() => markAsPosted(postData.id, postData.status, "tiktok")}>
                                    <FaTiktok className="icon tiktok" />
                                </a>
                            </div>
                        </div>
                    </Col>
                    <Col className="p-2" sm={12} md={6}>
                        <div className="post-card-container">
                            <div className="post-header d-flex justify-content-between">
                                <label htmlFor="thumbnail">
                                    Upload Thumbnail (Image / Video)
                                </label>

                                <button className="save-not-btn" onClick={handleSavingNote}>
                                    {noteSaveBtn}
                                </button>
                            </div>
                            <div className="w-100 d-flex justify-content-evenly position-relative" style={{ height: "343px" }}>
                                <textarea ref={note} className="note-textarea" placeholder="Enter A Note">
                                </textarea>
                            </div>
                        </div>
                    </Col>
                </Row>

            </div>
        </main >
    );
}

export default DisplayPost;
