import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './screens/Home';
import SQLInjection from './screens/SQLInjection';
import Blog from './screens/Blog';
import About from './screens/About';

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sql-injection" element={<SQLInjection />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
