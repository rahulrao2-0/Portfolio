import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './Pages.css';

const skills = [
  {
    label: 'Languages',
    items: ['JavaScript', 'Python', 'Java', 'C++', 'SQL', 'HTML5', 'CSS3'],
  },
  {
    label: 'Frontend',
    items: ['React 19', 'Redux Toolkit', 'Material-UI', 'Vite', 'Tailwind', 'Bootstrap'],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Express 5', 'REST APIs', 'WebRTC', 'Socket.IO', 'Microservices'],
  },
  {
    label: 'Databases & Cloud',
    items: ['MongoDB', 'MySQL', 'Redis', 'Kafka', 'AWS EC2', 'AWS S3', 'Docker', 'CI/CD'],
  },
];

const facts = [
  { label: 'Degree', value: 'B.Tech CSE' },
  { label: 'University', value: 'VIT Bhopal' },
  { label: 'Graduating', value: 'May 2027' },
  { label: 'CGPA', value: '8.0 / 10' },
];

const About = () => {
  return (
    <div className="page about-page">
      <div className="section-head">
        <p className="eyebrow">About</p>
        <h2 className="section-title">Who I am</h2>
      </div>

      <div className="about-layout">
        <div className="about-intro">
          <p className="about-lead">
            I am a B.Tech Computer Science Engineering student at Vellore Institute
            of Technology, Bhopal.
          </p>
          <p>
            I specialize in full-stack web development with a strong focus on
            backend architecture, real-time communications, and distributed
            systems. I love building things that scale and perform well.
          </p>

          <div className="fact-grid">
            {facts.map((fact) => (
              <div className="fact" key={fact.label}>
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
              </div>
            ))}
          </div>

          <Link to="/certifications" className="inline-link">
            See certifications <FaArrowRight size={12} />
          </Link>
        </div>

        <div className="skills-section">
          <h3 className="subsection-title">Technical Skills</h3>
          <div className="skills-grid">
            {skills.map((group) => (
              <div className="skill-category" key={group.label}>
                <h4>{group.label}</h4>
                <div className="skill-chips">
                  {group.items.map((item) => (
                    <span className="skill-chip" key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
