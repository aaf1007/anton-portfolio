import type { Project } from "@/data/portfolio";
import { FileText, Globe } from "lucide-react";
import { Fragment, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Gap } from "./Section";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Live, Building or Shipped, as a coloured dot and a word. */
function Status({ project }: { project: Project }) {
  if (project.inProgress) return <span className="s-status s-status--building">Building</span>;
  if (project.live) return <span className="s-status">Live</span>;
  return <span className="s-status s-status--shipped">Shipped</span>;
}

/** Where a card's image and title lead: the case study, else the live site, else the repo. */
function Target({ project, className, children, label }: { project: Project; className?: string; children: React.ReactNode; label?: string }) {
  const { caseStudy, live, github } = project;
  if (caseStudy)
    return (
      <Link to={caseStudy} className={className} aria-label={label}>
        {children}
      </Link>
    );
  const href = live ?? github;
  if (href)
    return (
      <a href={href} {...ext} className={className} aria-label={label}>
        {children}
      </a>
    );
  return (
    <span className={className} aria-label={label}>
      {children}
    </span>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { title, image, video, tint, context, contextIcon, shortDescription, stack, live, github, caseStudy, award } = project;
  const clip = useRef<HTMLVideoElement>(null);
  // a logo on a flat ground, not a screenshot: shown whole
  const logo = image?.includes("chewws") || image?.endsWith(".svg");

  const enter = () => {
    const v = clip.current;
    if (!v || reduce() || !image) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };
  const leave = () => clip.current?.pause();

  return (
    <article className="s-card" onMouseEnter={video ? enter : undefined} onMouseLeave={video ? leave : undefined}>
      <Target project={project} label={title} className={logo ? "s-card-media s-card-media--logo" : "s-card-media"}>
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: tint,
            backgroundImage: logo && image ? `url("${image}")` : undefined,
            backgroundSize: "inherit",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
        {image && !logo && <img src={image} alt="" loading="lazy" decoding="async" />}
        {video && (
          <video
            ref={clip}
            className={image ? undefined : "is-only"}
            // with no still to show, the recording's first frame stands in for one
            src={image ? video : `${video}#t=0.1`}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        )}
        {award && <span className="s-ribbon">🏆 {award}</span>}
      </Target>

      <div className="s-card-top">
        <div>
          <h3 className="s-card-title">
            <Target project={project}>{title}</Target>
          </h3>
          <p className="s-card-context">
            {contextIcon && <img src={contextIcon} alt="" aria-hidden />}
            {context}
          </p>
        </div>
        <Status project={project} />
      </div>

      <p className="s-card-desc">{shortDescription}</p>

      <div className="s-card-foot">
        <ul className="s-tags" aria-label="Built with">
          {stack.slice(0, 4).map((t) => (
            <li key={t} className="s-tag" style={{ listStyle: "none" }}>
              {t}
            </li>
          ))}
        </ul>
        <div className="s-card-links">
          {caseStudy && (
            <Link to={caseStudy} className="s-icon-btn" aria-label={`${title} case study`} title="Case study">
              <FileText size={16} strokeWidth={1.8} />
            </Link>
          )}
          {live && (
            <a href={live} {...ext} className="s-icon-btn" aria-label={`${title} live site`} title="Live site">
              <Globe size={16} strokeWidth={1.8} />
            </a>
          )}
          {github && (
            <a href={github} {...ext} className="s-icon-btn" aria-label={`${title} on GitHub`} title="GitHub">
              <FaGithub size={16} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** Cards two to a row, a banded gutter between the columns and a banded strip between the rows. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const rows: Project[][] = [];
  for (let i = 0; i < projects.length; i += 2) rows.push(projects.slice(i, i + 2));
  return (
    <div className="s-projects">
      {rows.map((row, r) => (
        <Fragment key={row[0].title}>
          {r > 0 && (
            <div className="s-row-gap">
              <Gap />
            </div>
          )}
          <ProjectCard project={row[0]} />
          <div className="s-projects-vgap" aria-hidden />
          {row[1] ? <ProjectCard project={row[1]} /> : <div aria-hidden />}
        </Fragment>
      ))}
    </div>
  );
}
