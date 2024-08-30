-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 30, 2024 at 10:16 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `social_media_manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `name`) VALUES
(1, '1135889.jpg'),
(2, 'deku-fallen-hero-monochrome-my-hero-academia-moewalls.com.mp4'),
(3, '1135212.jpg'),
(4, '1135889-1.jpg'),
(5, '1139017.jpg'),
(6, '1135212-1.jpg'),
(7, '1135889-2.jpg'),
(8, '1139017-1.jpg'),
(9, '1135212.jpg'),
(10, '1135889.jpg'),
(11, '1139017.jpg'),
(12, '1135212-1.jpg'),
(13, '1135889-1.jpg'),
(14, '1139017-1.jpg'),
(15, '1135212-2.jpg'),
(16, '1135889-2.jpg'),
(17, '1139017-2.jpg'),
(24, '1135212-5.jpg'),
(25, '1135889-5.jpg'),
(26, '1139017-5.jpg'),
(27, '1135212-6.jpg'),
(28, '1135889-6.jpg'),
(29, '1139017-6.jpg'),
(30, '1135212-7.jpg'),
(31, '1135889-7.jpg'),
(32, '1139017-7.jpg'),
(33, 'sung-jinwoo-assassin-solo-leveling-moewalls.com.mp4'),
(34, '1135889-8.jpg'),
(35, '1139017-8.jpg'),
(36, 'upside-down-spiderman-across-the-spider-verse-moewalls.com-1-.mp4'),
(37, 'wp10580597.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `hashtags`
--

CREATE TABLE `hashtags` (
  `id` int(11) NOT NULL,
  `hashtag` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hashtags`
--

INSERT INTO `hashtags` (`id`, `hashtag`) VALUES
(1, '#hashtag'),
(2, '#hashtag2'),
(3, '#hashtag1'),
(4, '#hashtags'),
(5, '#nature');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_uid`
--

CREATE TABLE `password_reset_uid` (
  `id` int(11) NOT NULL,
  `email` varchar(500) NOT NULL,
  `uid` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_reset_uid`
--

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `time` text DEFAULT NULL,
  `date` int(11) DEFAULT NULL,
  `month` text DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `hashtags` text DEFAULT NULL,
  `urls` text DEFAULT NULL,
  `files` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `thumbnail` text DEFAULT NULL,
  `type` text DEFAULT NULL,
  `status` text DEFAULT 'not posted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `description`, `time`, `date`, `month`, `year`, `hashtags`, `urls`, `files`, `user_id`, `thumbnail`, `type`, `status`) VALUES
(13, 'Walk Through Nature', 'This was an awesome walk through nature', '09:00 a.m.', 30, 'August', 2024, '5', '', '', 6, 'landscape-water-nature-forest-wilderness-image.jpg', 'instagram', 'posted'),
(14, 'Fishing Time!', 'Awesome fishing trip', '12:00 a.m.', 31, 'August', 2024, '', '', '', 6, 'on-the-shore-borrowdale-and-derwent-water-1518851.jpeg', 'facebook', 'not posted'),
(15, 'Swimming Off The Dock', 'Went Swimming Today', '01:00 p.m.', 29, 'August', 2024, '', '', '', 6, 'nature-quotes-landscape-1648265648.jpeg', 'twitter', 'not posted'),
(16, 'Nature Walk', 'Went For A Nature Walk.', '02:30 p.m.', 29, 'August', 2024, '', '', '', 6, 'nationalgeographic-2723899.jpeg', 'youtube', 'not posted'),
(17, 'Went To A Car Show', 'Went To A Car Show', '05:00 p.m.', 28, 'August', 2024, '', '', '', 6, 'Iola-Old-Car-Show-55-660x440-copy.jpg', 'instagram', 'not posted'),
(18, 'Morning Cup Of Coffee', 'Delisous Coffee', '12:00 a.m.', 27, 'August', 2024, '', '', '', 6, '20200331-coffee-05-copy.jpg', 'facebook', 'not posted'),
(19, 'Dinner Time', 'Steak Dinner', '05:30 p.m.', 27, 'August', 2024, '', '', '', 6, 'gold-filet1200x1200.jpeg', 'instagram', 'not posted'),
(20, 'Boating Today', 'Went Out Boating', '12:00 a.m.', 26, 'August', 2024, '', '', '', 6, '229A8628-1024x683.jpg', 'youtube', 'not posted');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `token` varchar(200) NOT NULL,
  `user_id` int(11) NOT NULL,
  `timestamp` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `token`, `user_id`, `timestamp`) VALUES
(25, '95e303d804b407e80e072dd0235000fc5f9ef248162a8b5e9c6f423010ae413c865af5813a0b14ec620f75de56202c1ef88f53d7accb04cec9f7e1de9b6f97a4', 6, '2024-08-28 16:22:13'),
(26, 'a3a28c0376dd12c216b6d92d8189410e8ab611977262ce55151c250c2ba706d49128bd0a876f984400bfdf22ee8f6119b8843a25c65a74bac8075fafb42d01a8', 6, '2024-08-28 22:11:56'),
(27, 'f1c0484ca25433e25be08fb85a8fef3fa59c6992cb939c907ffd083cd3268493e577621fd8e8af356ba394a1a359e606d5fba6951ffe34ad741c11986e52e9ef', 6, '2024-08-29 15:55:15'),
(28, 'c36df75db1c68d1fac8a6ab13125dd014783b8389054ab9432c02eebb5b2005a13098847ec0d7fb4cc04c24e5b1dd20d7b3c749b377d0f2e7656fc773819d2f9', 6, '2024-08-30 14:26:45'),
(29, '811704fd7f1834f914b5020625aded6698d86865e217a924bced3ae7d29db77f931e085dc1794a29a4dbfeb3010be351de9d3e7d144549d5736e1b5766904c66', 6, '2024-08-30 16:00:29'),
(30, '16e44f650301fb7dcbab728563a1f3ac3e9a7d5a36eee5963f27e8c7633a86c552580b3c1e00f190fd32abbbbe3c475f111a7cb2db56874bc05103cf33430703', 6, '2024-08-30 18:28:20'),
(31, '6feab215487ec84a145c1925c5e4677e7aa3c8e09138947aa4faf7b71eccc5e8eadb74722a26bd87d9ee183134acb2d8b447f580d649fae946b18737a9f0f690', 6, '2024-08-30 18:46:39');

-- --------------------------------------------------------

--
-- Table structure for table `urls`
--

CREATE TABLE `urls` (
  `id` int(11) NOT NULL,
  `url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `urls`
--

INSERT INTO `urls` (`id`, `url`) VALUES
(5, 'http://localhost:3000/instagram/5/August/2024'),
(6, 'url'),
(7, 'urls');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `email` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hashtags`
--
ALTER TABLE `hashtags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_hashtag` (`hashtag`) USING HASH;

--
-- Indexes for table `password_reset_uid`
--
ALTER TABLE `password_reset_uid`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `urls`
--
ALTER TABLE `urls`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_url` (`url`) USING HASH;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `hashtags`
--
ALTER TABLE `hashtags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `password_reset_uid`
--
ALTER TABLE `password_reset_uid`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `urls`
--
ALTER TABLE `urls`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
