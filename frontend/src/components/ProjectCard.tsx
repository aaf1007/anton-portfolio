import type { Project } from "@/data/portfolio";
import { go } from "@/lib/go";
import { useRef } from "react";
import "@/styles/works.css";

/** The status pill: building, an award, live, or shipped. */
export function Status({ project, className }: { project: Project; className?: string }) {
  const cls = (extra = "") => ["badge", extra, className].filter(Boolean).join(" ");
  if (project.inProgress)
    return (
      <span className={cls()}>
        <span className="status-dot status-dot--building" aria-hidden />
        Building
      </span>
    );
  if (project.award) return <span className={cls("badge--award")}>🏆 {project.award}</span>;
  return (
    <span className={cls()}>
      <span className="status-dot" aria-hidden />
      {project.live ? "Live" : "Shipped"}
    </span>
  );
}

const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ProjectCard({ project }: { project: Project }) {
  const { title, image, video, tint, context, contextIcon, caseStudy, live, github } = project;
  const href = caseStudy ?? live ?? github ?? "/projects";
  const internal = href.startsWith("/");
  const clip = useRef<HTMLVideoElement>(null);
  // a logo on a flat ground, not a screenshot: shown whole
  const logo = image?.includes("chewws");

  const enter = () => {
    const v = clip.current;
    if (!v || reduce()) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };
  const leave = () => {
    clip.current?.pause();
  };

  return (
    <a
      href={href}
      {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      onClick={
        internal
          ? (e) => {
              e.preventDefault();
              go(href);
            }
          : undefined
      }
      onMouseEnter={video ? enter : undefined}
      onMouseLeave={video ? leave : undefined}
      className="work-card"
    >
      <div
        className={logo ? "work-card-preview work-card-preview--logo" : "work-card-preview"}
        style={{ backgroundColor: tint, backgroundImage: image ? `url("${image}")` : undefined }}
      >
        {video && (
          <video
            ref={clip}
            className={image ? "work-card-video" : "work-card-video work-card-video--only"}
            // with no still to show, the recording's first frame stands in for one
            src={image ? video : `${video}#t=0.1`}
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
      </div>
      <div className="work-card-meta">
        <div className="work-card-meta-row">
          <p className="work-card-company">
            {contextIcon && <img src={contextIcon} alt="" aria-hidden className="work-card-company-icon" />}
            {context}
          </p>
          <Status project={project} />
        </div>
        <p className="work-card-title">{title}</p>
      </div>
    </a>
  );
}
