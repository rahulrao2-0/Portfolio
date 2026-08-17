import React from 'react';
import { FaGithub, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import './Pages.css';

const projects = [
  {
    title: 'LocalMart',
    date: 'Aug 2026',
    tagline: 'Hyperlocal e-commerce platform',
    description:
      'Engineered asynchronous event-driven workflows using Apache Kafka in KRaft mode. Built real-time delivery tracking with Socket.IO and Redis geospatial commands.',
    tech: ['React', 'Redux Toolkit', 'Node.js', 'Express', 'MongoDB', 'MySQL', 'Redis', 'Kafka'],
    link: 'https://github.com/rahulrao2-0/LocalMart',
  },
  {
    title: 'Perfume Storefront',
    date: 'Live',
    tagline: 'Responsive fragrance e-commerce frontend',
    description:
      'A styled, fully responsive perfume storefront — product showcase, fluid layouts and motion-led detail pages. Built with Vite and deployed on an AWS EC2 instance.',
    tech: ['React', 'Vite', 'CSS3', 'Responsive UI', 'AWS EC2'],
    link: 'http://ec2-15-207-254-178.ap-south-1.compute.amazonaws.com/',
  },
  {
    title: 'InterviewOS',
    date: 'Mar 2026',
    tagline: 'Recruitment & AI interview platform',
    description:
      'Built a real-time technical interview environment using WebRTC and Monaco Editor. Integrated OpenAI for real-time question generation.',
    tech: ['React.js', 'Node.js', 'MySQL', 'Redis', 'Socket.IO', 'WebRTC', 'AWS'],
    link: 'https://interviewos.online/',
  },
  {
    title: 'WanderLust',
    date: 'Jan 2026',
    tagline: 'Hotel booking platform',
    description:
      'Built real-time booking management with Socket.IO and atomic reservation validation. Integrated Mapbox API and OpenAI.',
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Razorpay', 'Mapbox', 'OpenAI API'],
    link: 'https://wanderlust-9yxw.vercel.app/',
  },
];

const isRepo = (url) => url.includes('github.com');

const Projects = () => {
  return (
    <div className="page projects-page">
      <div className="section-head">
        <p className="eyebrow">Work</p>
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-lede">
          Four builds, from event-driven commerce backends to a responsive
          storefront running on EC2.
        </p>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <article className="project-card" key={project.title}>
            <div className="project-top">
              <span className="project-index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={`project-date ${project.date === 'Live' ? 'is-live' : ''}`}>
                {project.date === 'Live' && <span className="live-dot" />}
                {project.date}
              </span>
            </div>

            <h3 className="project-title">{project.title}</h3>
            <p className="project-tagline">{project.tagline}</p>
            <p className="project-desc">{project.description}</p>

            <div className="tech-stack">
              {project.tech.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>

            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="project-link"
            >
              {isRepo(project.link) ? (
                <>
                  <FaGithub size={14} /> View code
                </>
              ) : (
                <>
                  <FaArrowUpRightFromSquare size={12} /> Visit site
                </>
              )}
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Projects;
