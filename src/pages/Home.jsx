import React from 'react';
import { Link } from 'react-router-dom';
import { FaDownload, FaArrowRight } from 'react-icons/fa';
import './Pages.css';

const Home = () => {
  return (
    <div className="page home-page">
      <div className="home-grid">
        <div className="home-content">
          <div className="status-badge">
            <span className="status-dot" />
            Open to 2027 internships
          </div>

          <h1 className="title">Rahul Yadav</h1>
          <h2 className="subtitle">
            Full-Stack <em>Web Developer</em>
          </h2>
          <p className="bio">
            Building scalable, asynchronous event-driven workflows and real-time
            applications with modern web technologies.
          </p>

          <div className="actions">
            <a href="/resume.pdf" download className="btn primary-btn">
              Download Resume <FaDownload size={15} />
            </a>
            {/* A plain <a> here reloaded the whole document, which skipped the
                transition entirely — router Link keeps navigation client-side. */}
            <Link to="/projects" className="btn secondary-btn">
              View Projects <FaArrowRight size={13} />
            </Link>
            <Link to="/contact" className="btn ghost-btn">Get in touch</Link>
          </div>

          <div className="home-meta">
            <div className="home-meta-item">
              <span>Focus</span>
              <strong>Backend &amp; Real-time</strong>
            </div>
            <div className="home-meta-item">
              <span>Studying</span>
              <strong>B.Tech CSE, VIT Bhopal</strong>
            </div>
            <div className="home-meta-item">
              <span>Based in</span>
              <strong>India</strong>
            </div>
          </div>
        </div>

        {/* No frame, no ring, no box: the photo's background is already removed,
            so the figure's own silhouette is the edge. Pages.css crops the empty
            part of the frame, grades the photo into the page's cool light and
            dissolves the bottom, where the torso runs out of the photo. */}
        <div className="home-portrait">
          <img
            src="/rahul_photo-removebg-preview.png"
            alt="Rahul Yadav"
            width="375"
            height="666"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
