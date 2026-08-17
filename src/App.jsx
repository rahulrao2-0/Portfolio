import React, { useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import Navigation from './components/Navigation';
import GalaxyBackground from './components/GalaxyBackground';
import TransitionWrapper from './components/TransitionWrapper';
import Cursor from './components/Cursor';
import useScrollNavigation from './hooks/useScrollNavigation';
import { ROUTES, ROUTE_LABELS, routeIndex, setNavDirection } from './utils/pageTransition';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Certifications from './pages/Certifications';
import Contact from './pages/Contact';
import './App.css';

function App() {
  const location = useLocation();
  const { goToIndex, activeIndex } = useScrollNavigation();

  // Resolve the slide direction from the route change itself, so nav links, the
  // section dots and the scroll gestures all animate consistently.
  const prevPathRef = useRef(location.pathname);
  if (prevPathRef.current !== location.pathname) {
    setNavDirection(routeIndex(location.pathname) - routeIndex(prevPathRef.current));
    prevPathRef.current = location.pathname;
  }

  const isLast = activeIndex === ROUTES.length - 1;

  return (
    <>
      <GalaxyBackground />
      <Cursor />
      <div className="app-container">
        <Navigation />

        <TransitionGroup className="transition-group">
          <TransitionWrapper key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </TransitionWrapper>
        </TransitionGroup>

        <div className="page-dots" role="tablist" aria-label="Sections">
          {ROUTES.map((route, i) => (
            <button
              key={route}
              type="button"
              role="tab"
              className={`page-dot ${i === activeIndex ? 'active' : ''}`}
              aria-selected={i === activeIndex}
              aria-label={ROUTE_LABELS[i]}
              onClick={() => goToIndex(i)}
            >
              <span className="page-dot-label">{ROUTE_LABELS[i]}</span>
            </button>
          ))}
        </div>

        <div className={`scroll-hint ${isLast ? 'hidden' : ''}`} aria-hidden="true">
          <span className="scroll-hint-text">Scroll</span>
          <span className="scroll-hint-track">
            <span className="scroll-hint-dot" />
          </span>
        </div>
      </div>
    </>
  );
}

export default App;
