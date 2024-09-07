import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoutes.js';
import { DataProvider } from './dataContext/dataContext.js';

import Home from "./pages/Home.js";
import Dashboard from './pages/Dashboard.js';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Post from './pages/Post.js';
import Header from './components/Header';
import Calendar from './pages/Calendar.js';
import DisplayPost from './pages/DisplayPost.js';

import './assets/css/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Router>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </Router>
  )
}

function AppContent() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/:error" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/:error" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/dashboard/:date/:month/:year" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/post/:date/:month/:year/:type" element={<ProtectedRoute element={<Post />} />} />
        <Route path="/calendar" element={<ProtectedRoute element={<Calendar />} />} />
        <Route path="/display_post/:post" element={<ProtectedRoute element={<DisplayPost />} />} />
      </Routes>
    </>
  );
}

export default App;