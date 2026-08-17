import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import './Pages.css';

const EMAIL = 'yadavrahul81135@gmail.com';

const channels = [
  {
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: FaEnvelope,
  },
  {
    label: 'GitHub',
    value: 'rahulrao2-0',
    href: 'https://github.com/rahulrao2-0',
    icon: FaGithub,
  },
  {
    label: 'LinkedIn',
    value: 'rahul-yadav-073756289',
    href: 'https://www.linkedin.com/in/rahul-yadav-073756289',
    icon: FaLinkedin,
  },
  {
    label: 'Based in',
    value: 'India · open to remote',
    icon: FaMapMarkerAlt,
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  // No backend here, so the form hands off to the visitor's mail client with
  // everything already filled in.
  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name || 'a visitor'}`);
    const body = encodeURIComponent(
      `${form.message}\n\n—\n${form.name}\n${form.email}`,
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="page contact-page">
      <div className="section-head">
        <p className="eyebrow">Contact</p>
        <h2 className="section-title">Let&rsquo;s build something</h2>
        <p className="section-lede">
          Open to 2027 internships, freelance frontends and backend work. Drop a
          line and I&rsquo;ll get back to you.
        </p>
      </div>

      <div className="contact-layout">
        <div className="contact-channels">
          {channels.map((channel) => {
            const Icon = channel.icon;
            const inner = (
              <>
                <span className="channel-icon">
                  <Icon size={16} />
                </span>
                <span className="channel-text">
                  <span className="channel-label">{channel.label}</span>
                  <span className="channel-value">{channel.value}</span>
                </span>
              </>
            );

            return channel.href ? (
              <a
                className="channel"
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
              >
                {inner}
              </a>
            ) : (
              <div className="channel channel-static" key={channel.label}>
                {inner}
              </div>
            );
          })}
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="field-row">
            <label className="field">
              <span>Name</span>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="Your name"
                required
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
                required
              />
            </label>
          </div>

          <label className="field">
            <span>Message</span>
            <textarea
              rows={4}
              value={form.message}
              onChange={update('message')}
              placeholder="What are you building?"
              required
            />
          </label>

          <button type="submit" className="btn primary-btn contact-submit">
            Send message <FaArrowRight size={14} />
          </button>

          <p className="form-note">
            Opens in your mail app — nothing is stored on this site.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Contact;
