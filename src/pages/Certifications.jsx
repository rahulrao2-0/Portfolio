import React from 'react';
import { FaAward, FaExternalLinkAlt, FaGraduationCap } from 'react-icons/fa';
import './Pages.css';

const certifications = [
  {
    name: 'Google IT Support Professional Certificate',
    issuer: 'Google · Coursera',
    date: 'Issued Mar 2026',
    href: 'https://www.credly.com/go/Hm9FIysF',
    action: 'View Badge',
    icon: FaAward,
    covers: ['Networking', 'Operating Systems', 'System Administration', 'Security', 'Troubleshooting'],
  },
  {
    name: 'Full Stack Web Development',
    issuer: 'Apna College',
    date: 'Completed 2024',
    href: 'https://mycourse.app/KtYsek7UXcmva4CVD',
    action: 'View Credential',
    icon: FaGraduationCap,
    covers: ['HTML & CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
  },
];

const education = {
  degree: 'B.Tech, Computer Science & Engineering',
  school: 'Vellore Institute of Technology, Bhopal',
  meta: 'Expected May 2027 · CGPA 8.0 / 10',
};

const Certifications = () => {
  return (
    <div className="page certifications-page">
      <div className="section-head">
        <p className="eyebrow">Credentials</p>
        <h2 className="section-title">Certifications &amp; Education</h2>
        <p className="section-lede">
          Verified programmes behind the stack I build with — every credential
          below links straight to its issuer.
        </p>
      </div>

      <div className="cert-grid">
        {certifications.map((cert) => {
          const Icon = cert.icon;
          return (
            <article className="cert-card" key={cert.name}>
              <div className="cert-card-top">
                <span className="cert-icon">
                  <Icon size={18} />
                </span>
                <span className="cert-date">{cert.date}</span>
              </div>

              <h3 className="cert-card-title">{cert.name}</h3>
              <p className="cert-issuer">{cert.issuer}</p>

              <div className="cert-covers">
                {cert.covers.map((item) => (
                  <span className="cert-cover" key={item}>{item}</span>
                ))}
              </div>

              <a
                className="cert-cta"
                href={cert.href}
                target="_blank"
                rel="noreferrer"
              >
                {cert.action} <FaExternalLinkAlt size={11} />
              </a>
            </article>
          );
        })}

        <article className="cert-card cert-card-edu">
          <div className="cert-card-top">
            <span className="cert-icon">
              <FaGraduationCap size={18} />
            </span>
            <span className="cert-date">Education</span>
          </div>

          <h3 className="cert-card-title">{education.degree}</h3>
          <p className="cert-issuer">{education.school}</p>
          <p className="cert-edu-meta">{education.meta}</p>
        </article>
      </div>
    </div>
  );
};

export default Certifications;
