import GitHubActivity from "@/components/site/GitHubActivity";
import HomeExperience from "@/components/site/HomeExperience";
import HomePhotos from "@/components/site/HomePhotos";
import { ProjectGrid } from "@/components/site/ProjectCard";
import RoleCycle from "@/components/site/RoleCycle";
import { Gap, Section } from "@/components/site/Section";
import { delay } from "@/lib/stagger";
import TechStack from "@/components/site/TechStack";
import { about, links, profile, projects } from "@/data/portfolio";
import { ArrowUpRight, Paperclip } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const latest = [...projects].reverse().slice(0, 4);
const ghUser = links.github.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");

const initials = profile.name
  .split(" ")
  .map((w) => w[0])
  .join("");

function Banner() {
  // until the file is in public/, the placeholder holds its place
  const [missing, setMissing] = useState(!profile.banner);
  return missing ? (
    <div className="s-banner-media s-placeholder">banner image · 1600 × 420</div>
  ) : (
    <img className="s-banner-media" src={profile.banner} alt="" onError={() => setMissing(true)} />
  );
}

function Identity() {
  return (
    <>
      <div className="s-banner s-rule-b s-in">
        <Banner />
      </div>
      <div className="s-id s-rule-b s-in" style={delay(1)}>
        <div className="s-avatar">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} />
          ) : (
            <div className="s-placeholder" role="img" aria-label={profile.name}>
              {initials}
            </div>
          )}
        </div>
        <div className="s-id-text">
          <svg className="s-id-mark" width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <circle cx="7" cy="7" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 1.25a5.75 5.75 0 0 0 0 11.5z" fill="currentColor" />
          </svg>
          <h1 className="s-name">{profile.name}</h1>
          <RoleCycle roles={profile.roles} />
          <p className="s-loc">{profile.location}</p>
        </div>
      </div>
    </>
  );
}

const contacts: { label: string; href: string; icon: ReactNode; internal?: boolean }[] = [
  { label: "GitHub", href: links.github, icon: <FaGithub size={18} /> },
  { label: "LinkedIn", href: links.linkedin, icon: <FaLinkedinIn size={17} /> },
  { label: "Resume", href: links.resume, icon: <Paperclip size={17} strokeWidth={1.8} />, internal: true },
];

function Contact() {
  return (
    <ul className="s-contact" style={{ "--n": contacts.length } as CSSProperties}>
      {contacts.map(({ label, href, icon, internal }) => {
        const inner = (
          <>
            <span className="s-contact-icon">{icon}</span>
            {label}
            <ArrowUpRight className="s-contact-arrow" size={15} strokeWidth={1.8} />
          </>
        );
        return (
          <li key={label}>
            {internal ? (
              <Link to={href}>{inner}</Link>
            ) : (
              <a href={href} {...ext}>
                {inner}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function HomePage() {
  return (
    <>
      <Identity />
      <Gap />
      <Section title="About" order={2}>
        <ul className="s-about">
          {about.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </Section>
      <Gap />
      <Section title="Contact" order={3} bodyClass="">
        <Contact />
      </Section>
      <Gap />
      <Section
        title="Experience"
        order={4}
        bodyClass=""
        aside={
          <Link to="/experience" className="s-more">
            View all <ArrowUpRight size={14} strokeWidth={1.8} />
          </Link>
        }
      >
        <HomeExperience />
      </Section>
      <Gap />
      <Section
        title="Projects"
        order={5}
        bodyClass=""
        aside={
          <Link to="/projects" className="s-more">
            View all <ArrowUpRight size={14} strokeWidth={1.8} />
          </Link>
        }
      >
        <ProjectGrid projects={latest} />
      </Section>
      <Gap />
      <Section
        title="Photos"
        order={6}
        bodyClass=""
        aside={
          <Link to="/photos" className="s-more">
            View all <ArrowUpRight size={14} strokeWidth={1.8} />
          </Link>
        }
      >
        <HomePhotos />
      </Section>
      <Gap />
      <TechStack order={7} />
      <Gap />
      <Section title="GitHub Activity" order={8}>
        <GitHubActivity user={ghUser} />
      </Section>
    </>
  );
}
