import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Placeholder from "../assets/images/instagram-placeholder.png";
import { PostData } from "../utils/PostData";
import "../assets/css/display-post.css";

import { FaCopy } from "react-icons/fa";

function DisplayPost() {
    const { post } = useParams();
    const [hashtags, setHashtags] = useState([]);
    const [urls, setUrls] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [postData, setPostData] = useState(null);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        // Fetch post data
        PostData('get-post.php', { post }, sessionStorage.getItem('userData'))
            .then((result) => {
                if (!result.status) {
                    setError(result.message);
                    return;
                }

                const data = result.data[0];
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

                setLoading(false);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <main className="p-3">
            {error && <Alert variant="danger">{error}</Alert>}

            <div className="post-form">
                <Link className="back-btn" to={`/dashboard/${postData.date}/${(months.findIndex(month => month === postData.month)) + 1}/${postData.year}`}>Back</Link>
                <h1 className="mt-3">{postData ? postData.title : 'No title available'}</h1>
                <hr />
                <label className="mb-2 fs-4" htmlFor="description">Post Description
                    <button className="copy-btn" onClick={() => copyToClipboard(postData.description)} variant="primary">
                        <FaCopy />
                    </button>
                </label>
                <div className="description-container">
                    <p className="display-post-description">{postData.description}</p>
                </div>

                <h4>Media Preview</h4>

                <div className="w-100 d-flex justify-content-evenly position-relative">
                    <div className="display-instagram-uploads thumbnail">
                        {postData.thumbnail ? (
                            <div>
                                {postData.thumbnail.endsWith(".jpg") || postData.thumbnail.endsWith(".png") || postData.thumbnail.endsWith(".jpeg") ? (
                                    <img src={`https://localhost/social-media-manager/assets/${postData.thumbnail}`} alt={postData.thumbnail} />
                                ) : postData.thumbnail.endsWith(".mp4") || postData.thumbnail.endsWith(".mov") || postData.thumbnail.endsWith(".avi") ? (
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
                                    {file.name.endsWith(".jpg") || file.name.endsWith(".png") || file.name.endsWith(".jpeg") ? (
                                        <img src={`https://localhost/social-media-manager/assets/${file.name}`} alt={file.name} />
                                    ) : file.name.endsWith(".mov") || file.name.endsWith(".mp4") || file.name.endsWith(".avi") ? (
                                        <video controls>
                                            <source src={`https://localhost/social-media-manager/assets/${file.name}`} type={`video/${file.name.split('.').pop()}`} />
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

                <label htmlFor="hashtags">Hashtags</label>
                <div className="hashtag-list">
                    <button onClick={copyAllHashtags} variant="primary" className="mb-3 copy-hashtag-btn">
                        <FaCopy className="copy-hashtag-btn" />
                    </button>
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
            </div>
        </main >
    );
}

export default DisplayPost;
