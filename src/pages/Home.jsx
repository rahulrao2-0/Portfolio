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

        {/* The portrait is masked and graded rather than framed, so its edges
            dissolve into the star field instead of sitting in a hard box. */}
        <div className="home-portrait" aria-hidden="false">
          <span className="portrait-glow" />
          <span className="portrait-ring" />
          <img src="/rahul_photo.jpeg" alt="Rahul Yadav" width="720" height="900" />
          <span className="portrait-veil" />
        </div>
      </div>
    </div>
  );
};

export default Home;
