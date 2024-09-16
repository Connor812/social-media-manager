import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PostData, UploadFilesAndData } from "../utils/PostData";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Alert, Modal, Button, Row, Col } from "react-bootstrap";
import Placeholder from "../assets/images/instagram-placeholder.png";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../assets/css/instagram.css";

function Instagram() {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [hashtagInput, setHashtagInput] = useState("");
    const [hashtags, setHashtags] = useState([]);
    const [urlInput, setUrlInput] = useState("");
    const [urls, setUrls] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loadingHashtags, setLoadingHashtags] = useState(true);
    const imageInput = useRef(null);
    const title = useRef(null);
    const description = useRef(null);
    const thumbnailInput = useRef(null);
    const { date, month, year, type } = useParams();
    const [timeValue, setTimeValue] = useState(new Date());
    const [usersHashtags, setUsersHashtags] = useState([]);
    const [userHashtagGroup, setUserHashtagGroup] = useState([]);
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    // Convert month name to number
    const monthNameToNumber = (monthName) => {
        const months = [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ];
        return months.indexOf(monthName) + 1;
    };

    useEffect(() => {
        PostData("get-hashtags.php", {}, sessionStorage.getItem("userData"))
            .then((result) => {
                if (result.status) {
                    setUsersHashtags(result.data);
                    setLoadingHashtags(false);
                }
            }).catch((error) => {
                console.error("Error:", error);
                setLoadingHashtags(false);
            });
    }, []);

    // Initialize the date based on URL parameters
    useEffect(() => {
        if (date && month && year) {
            const initialDate = new Date(year, monthNameToNumber(month) - 1, date);
            setTimeValue(initialDate);
        }
    }, [date, month, year]);

    const MAX_FILE_SIZE_MB = 100;

    const handleUploads = () => {
        const files = Array.from(imageInput.current.files);
        const totalSizeMB = files.reduce((total, file) => total + file.size / (1024 * 1024), 0);

        if (totalSizeMB > MAX_FILE_SIZE_MB) {
            alert("Total file size exceeds 100MB. Please upload smaller files.");
            setUploadedFiles([]);
            imageInput.current.value = ""; // Clear the input
        } else {
            setUploadedFiles(files);
        }
    };

    const handleUploadThumbnail = () => {
        const file = thumbnailInput.current.files[0];

        if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
            alert("File size exceeds 100MB. Please upload a smaller file.");
            setThumbnail(null);
            thumbnailInput.current.value = ""; // Clear the input
        } else {
            setThumbnail(file);
        }
    }

    const addHashtag = () => {
        if (hashtagInput.trim() !== "") {
            setHashtags((prevHashtags) => [...prevHashtags, `#${hashtagInput.trim()}`]);
            setHashtagInput("");
        }
    };

    const removeHashtag = (indexToRemove) => {
        setHashtags((prevHashtags) =>
            prevHashtags.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addHashtag();
        }
    };

    const addUrl = () => {
        if (urlInput.trim() !== "") {
            setUrls((prevUrls) => [...prevUrls, urlInput.trim()]);
            setUrlInput("");
        }
    };

    const removeUrl = (indexToRemove) => {
        setUrls((prevUrls) =>
            prevUrls.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleFormSubmit = () => {
        // Check if title, time, and thumbnail are present
        if (!title.current.value.trim()) {
            setError("Title is required.");
            window.scrollTo(0, 0);
            return;
        }
        if (!timeValue) {
            setError("Time is required.");
            window.scrollTo(0, 0);
            return;
        }
        if (!thumbnail) {
            setError("Thumbnail is required.");
            window.scrollTo(0, 0);
            return;
        }

        // Format time for submission
        const formattedTime = timeValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

        // Format date for submission
        const day = timeValue.getDate();
        const month = timeValue.toLocaleString('default', { month: 'long' });
        const year = timeValue.getFullYear();

        const body = {
            title: title.current.value,
            time: formattedTime, // Use formatted time for submission
            description: description.current.value,
            hashtags: hashtags,
            urls: urls,
            date: day,
            month: month,
            year: year,
            type: type,
        };

        // Pass both the thumbnail and main files to the UploadFilesAndData function
        UploadFilesAndData("post.php", body, thumbnail, uploadedFiles, sessionStorage.getItem("userData"))
            .then((result) => {
                if (!result.status) {
                    setError(result.message);
                    window.scrollTo(0, 0);
                } else {
                    setSuccess(result.message);
                    title.current.value = "";
                    description.current.value = "";
                    setHashtags([]);
                    setUrls([]);
                    setThumbnail(null);
                    setUploadedFiles([]);
                    imageInput.current.value = "";
                    thumbnailInput.current.value = "";
                    window.scrollTo(0, 0);
                }
            })
            .catch((error) => {
                setError("An error occurred. Please try again.");
                window.scrollTo(0, 0);
            });
    };

    const handleHashtagChange = (e, hashtag) => {
        if (e.target.checked) {
            // Add hashtag if checked and not already in the list
            if (!hashtags.includes(hashtag)) {
                setHashtags((prevHashtags) => [...prevHashtags, hashtag]);
            }
        } else {
            // Remove hashtag if unchecked
            setHashtags((prevHashtags) =>
                prevHashtags.filter((existingHashtag) => existingHashtag !== hashtag)
            );
        }
    };

    return (
        <main className="instagram-post">
            <div className="post-form">
                <h1>Schedule {type.charAt(0).toUpperCase() + type.slice(1)} Post</h1>
                <hr />
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <div className="d-flex gap-3">
                    <div className="w-100">
                        <input className="post-input" type="text" id="post-title" placeholder="Enter post title" ref={title} />
                    </div>
                    <div className="w-100 d-flex flex-column">
                        <DatePicker
                            className="w-100 post-input"
                            selected={timeValue}
                            onChange={(date) => setTimeValue(date)}
                            showTimeSelect
                            timeFormat="hh:mm aa" // 12-hour format with AM/PM
                            timeIntervals={15}
                            dateFormat="h:mm aa" // Only time with AM/PM
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                        />
                    </div>
                </div>
                <textarea className="post-input" id="description" rows="5" placeholder="Enter post description" ref={description} ></textarea>

                <div className="post-input-container">
                    <input
                        className="post-input"
                        type="text"
                        id="hashtags"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Enter hashtag"
                    />
                    <button type="button" className="add-hashtag-button" onClick={handleShow}>
                        Hashtags
                    </button>
                </div>

                <div className="hashtag-list">
                    {hashtags.map((hashtag, index) => (
                        <span key={index} className="hashtag">
                            <button
                                type="button"
                                className="remove-hashtag-button"
                                onClick={() => removeHashtag(index)}
                            >
                                &times;
                            </button>
                            {hashtag}
                        </span>
                    ))}
                </div>

                <div className="post-input-container">
                    <input
                        className="post-input"
                        type="text"
                        id="urls"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addUrl();
                            }
                        }}
                        placeholder="Enter URL"
                    />
                    <button type="button" className="add-hashtag-button" onClick={handleShow}>
                        Urls
                    </button>
                </div>

                <div className="url-list">
                    {urls.map((url, index) => (
                        <span key={index} className="url">
                            <button
                                type="button"
                                className="remove-url-button"
                                onClick={() => removeUrl(index)}
                            >
                                &times;
                            </button>
                            <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                        </span>
                    ))}
                </div>




                <Row className="p-4">
                    <Col className="p-2" sm={12} md={6}>
                        <div className="post-card-container">
                            <div className="post-header">
                                <label htmlFor="thumbnail">
                                    Upload Thumbnail (Image / Video)
                                </label>
                                <input
                                    id="thumbnail"
                                    type="file"
                                    accept="image/*, video/*"
                                    multiple
                                    onInput={handleUploadThumbnail}
                                    ref={thumbnailInput}
                                    className="mb-2 post-header"
                                />
                            </div>
                            <div className="w-100 d-flex justify-content-center position-relative">
                                <div className="display-instagram-uploads thumbnail">
                                    {thumbnail ?
                                        <div>
                                            {thumbnail.type.startsWith("image/") ?
                                                <img src={URL.createObjectURL(thumbnail)} alt={thumbnail.name} />
                                                : thumbnail.type.startsWith("video/") ?
                                                    <video controls>
                                                        <source src={URL.createObjectURL(thumbnail)} type={thumbnail.type} />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                    : <p>Unsupported media type</p>
                                            }
                                        </div>
                                        : (
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
                                <label htmlFor="uploads">Upload Content (Images / Videos)</label>
                                <input
                                    id="uploads" uploads
                                    type="file"
                                    accept="image/*, video/*"
                                    multiple
                                    onInput={handleUploads}
                                    ref={imageInput}
                                    className="mb-2"
                                />
                            </div>
                            <div className="w-100 d-flex justify-content-center position-relative">
                                <Swiper
                                    className="mySwiper display-instagram-uploads"
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    slidesPerView={1}
                                >
                                    {uploadedFiles.length > 0 ? (
                                        uploadedFiles.map((file, index) => (
                                            <SwiperSlide key={index} className="instagram-slide">
                                                {file.type.startsWith("image/") ? (
                                                    <img src={URL.createObjectURL(file)} alt={file.name} />
                                                ) : file.type.startsWith("video/") ? (
                                                    <video controls>
                                                        <source src={URL.createObjectURL(file)} type={file.type} />
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

                <button type="submit" className="save-button" onClick={handleFormSubmit}>Save Post</button>
            </div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Select Hashtags</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loadingHashtags ? (
                        "Loading hashtags..."
                    ) : (
                        <div>
                            <div>
                                <label htmlFor="">Hashtag groups</label>

                            </div>

                            <div className="hashtag-list">
                                {usersHashtags.map((hashtagObj, index) => (
                                    <div key={index} className="form-check display-users-hashtags">
                                        <input
                                            type="checkbox"
                                            id={`hashtag-${index}`}
                                            value={hashtagObj.hashtag}
                                            checked={hashtags.includes(hashtagObj.hashtag)} // Compare without the `#`
                                            onChange={(e) => handleHashtagChange(e, hashtagObj.hashtag)} // Handle change
                                        />
                                        <label className="form-check-label" htmlFor={`hashtag-${index}`}>
                                            {hashtagObj.hashtag}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </main>
    );
}


export default Instagram;
