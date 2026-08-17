import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { ROUTES, ROUTE_LABELS } from '../utils/pageTransition';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <Link to="/" className="nav-brand">
        RY<span>.</span>
      </Link>

      {/* Driven off ROUTES so the links, the section dots and the scroll order
          can never drift apart. */}
      <div className="nav-links">
        {ROUTES.map((route, i) => (
          <Link
            key={route}
            to={route}
            className={location.pathname === route ? 'active' : ''}
          >
            {ROUTE_LABELS[i]}
          </Link>
        ))}
      </div>

      <div className="nav-socials">
        <a
          href="https://github.com/rahulrao2-0"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <FaGithub size={18} />
        </a>
        <a
          href="https://www.linkedin.com/in/rahul-yadav-073756289"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin size={18} />
        </a>
        <a href="mailto:yadavrahul81135@gmail.com" aria-label="Email">
          <FaEnvelope size={18} />
        </a>
      </div>
    </nav>
  );
};

export default Navigation;
