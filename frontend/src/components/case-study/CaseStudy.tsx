import { projects, type Project } from "@/data/portfolio";
import { CircleAlert, CircleCheck, CircleX, Lightbulb, Wrench, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import "./case-study.css";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function useProject() {
  const { pathname } = useLocation();
  return projects.find((p) => p.caseStudy === pathname);
}

const Icon = ({ icon: I, size = 20 }: { icon: LucideIcon; size?: number }) => (
  <I className="cs-icon" size={size} strokeWidth={1.75} aria-hidden />
);

/** The status pill: building, an award, live, or shipped. */
function Status({ project, as: Tag = "span" }: { project: Project; as?: "span" | "li" }) {
  if (project.inProgress)
    return (
      <Tag className="badge">
        <span className="status-dot status-dot--building" aria-hidden />
        Building
      </Tag>
    );
  if (project.award)
    return (
      <Tag className="badge badge--award">
        <span aria-hidden>🏆</span>
        {project.award}
      </Tag>
    );
  return (
    <Tag className="badge">
      <span className="status-dot" aria-hidden />
      {project.live ? "Live" : "Shipped"}
    </Tag>
  );
}

/**
 * The page: one column whose body scrolls up over the fixed hero image.
 * Images marked .cs-expandable open in a lightbox.
 */
export function CaseStudy({ children }: { children: ReactNode }) {
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!zoom) return;
    const frame = requestAnimationFrame(() => setShown(true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShown(false);
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
    };
  }, [zoom]);

  return (
    <div
      className="cs"
      onClick={(e) => {
        const img = (e.target as HTMLElement).closest<HTMLImageElement>("img.cs-expandable");
        if (img) setZoom({ src: img.currentSrc || img.src, alt: img.alt });
      }}
    >
      <div className="cs-scroll-body">{children}</div>
      {zoom &&
        createPortal(
          <div
            className={`cs-lightbox${shown ? " is-visible" : ""}`}
            role="dialog"
            aria-label={zoom.alt || "Image"}
            onClick={() => setShown(false)}
            onTransitionEnd={() => !shown && setZoom(null)}
          >
            <img src={zoom.src} alt={zoom.alt} />
          </div>,
          document.body,
        )}
    </div>
  );
}

/** Fixed left rail: back, then the page's sections; the one being read is lit. */
function Rail() {
  const [items, setItems] = useState<{ id: string; label: string }[]>([]);
  const [active, setActive] = useState("");
  // a click on the rail holds its section lit while the page scrolls there
  const locked = useRef(false);
  const lockTimer = useRef(0);

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-toc]")];
    const frame = requestAnimationFrame(() => setItems(sections.map((el) => ({ id: el.id, label: el.dataset.toc! }))));
    const mark = (id: string) => {
      setActive(id);
      sections.forEach((s) => s.classList.toggle("is-active", s.id === id));
    };
    // the last section whose top has passed 65% of the viewport
    const update = () => {
      if (locked.current) return;
      const line = window.innerHeight * 0.65;
      let id = sections[0]?.id ?? "";
      for (const s of sections) if (s.getBoundingClientRect().top <= line) id = s.id;
      if (id) mark(id);
    };
    const onLock = (e: Event) => mark((e as CustomEvent<string>).detail);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("cs-jump", onLock);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("cs-jump", onLock);
      sections.forEach((s) => s.classList.remove("is-active"));
    };
  }, []);

  const jump = (id: string) => {
    window.dispatchEvent(new CustomEvent("cs-jump", { detail: id }));
    locked.current = true;
    window.clearTimeout(lockTimer.current);
    const release = () => {
      locked.current = false;
      window.clearTimeout(lockTimer.current);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchmove", release);
      window.removeEventListener("keydown", release);
    };
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchmove", release, { passive: true });
    window.addEventListener("keydown", release);
    lockTimer.current = window.setTimeout(release, 1200);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="cs-sidenav" aria-label="Case study sections">
      <Link to="/projects" className="cs-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </Link>
      <nav className="cs-side-nav">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className={`cs-side-link${active === it.id ? " is-active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              jump(it.id);
            }}
          >
            {it.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

/** The fixed hero image, the rail, and the header: where it was made, the title, its tags. */
export function Hero({ src, alt, title }: { src: string; alt: string; title: string }) {
  const project = useProject();
  const tags = project?.stack.slice(0, 2) ?? [];

  return (
    <>
      {createPortal(
        <>
          <div className="cs-hero-visual" aria-hidden>
            <img className="cs-hero-bg" src={src} alt={alt} />
          </div>
          <Rail />
        </>,
        document.body,
      )}
      <header className="cs-hero">
        {project && (
          <p className="cs-company">
            {project.contextIcon && <img src={project.contextIcon} alt="" className="cs-company-icon" />}
            {project.context}
          </p>
        )}
        <h1 className="cs-h1">{project?.title ?? title}</h1>
        <ul className="cs-tags">
          {project && <Status project={project} as="li" />}
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </header>
    </>
  );
}

/** TL;DR: the pitch, then the key facts. */
export function Intro({ meta, children }: { meta: { label: string; value: string }[]; children: ReactNode }) {
  return (
    <section id="tldr" data-toc="TL;DR" className="cs-section">
      <p className="cs-section-label">TL;DR</p>
      <div className="cs-prose">{children}</div>
      <dl className="cs-meta">
        {meta.map((m) => (
          <div key={m.label} className="cs-meta-row">
            <dt>{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className="cs-body">{children}</p>;
}

/** A chapter: its label (also its entry in the rail) and an optional heading. */
export function Section({ eyebrow, heading, children }: { eyebrow: string; heading?: string; children: ReactNode }) {
  const label = eyebrow.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  return (
    <section id={slug(eyebrow)} data-toc={label} className="cs-section">
      <p className="cs-section-label">{label}</p>
      {heading && <h2 className="cs-h2">{heading}</h2>}
      {children}
    </section>
  );
}

/** A pain point, as a card. */
export function Beat({ title, body }: { title: string; body: ReactNode; glyph?: string }) {
  return (
    <div className="cs-iter-item">
      <p className="cs-card-label">
        <Icon icon={CircleAlert} />
        {title}
      </p>
      <p className="cs-card-body">{body}</p>
    </div>
  );
}

/** A first attempt (or, muted, what was wrong with it), as a card. */
export function Card({ title, tone = "default", children }: { title: string; tone?: "default" | "muted"; children: ReactNode }) {
  return (
    <div className="cs-iter-item">
      <p className="cs-card-label">
        <Icon icon={tone === "muted" ? CircleX : Wrench} />
        {title}
      </p>
      <div className="cs-card-body">{children}</div>
    </div>
  );
}

/** A numbered step: the number rides along (sticky) while its text and image scroll. */
export function Feature({
  number,
  title,
  body,
  image,
  alt,
}: {
  number: number;
  title: string;
  body: ReactNode;
  image: string;
  alt: string;
  reverse?: boolean;
}) {
  return (
    <div className="cs-step">
      <span className="cs-step-num">{String(number).padStart(2, "0")}</span>
      <div className="cs-step-body">
        <h3 className="cs-h3">{title}</h3>
        <p className="cs-body">{body}</p>
        <img src={image} alt={alt} loading="lazy" className="cs-image cs-expandable" />
      </div>
    </div>
  );
}

/** A connecting line between two steps. */
export function Bridge({ children }: { children: ReactNode }) {
  return <p className="cs-bridge">{children}</p>;
}

/** A lesson or a next step: icon above, title beside its body. */
export function Reflection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="cs-learning">
      <Icon icon={Lightbulb} />
      <h3 className="cs-h3">{title}</h3>
      <p className="cs-body">{children}</p>
    </div>
  );
}

export function ImpactList({ items }: { items: string[] }) {
  return (
    <div className="cs-considerations">
      <ul className="cs-consideration-list">
        {items.map((item) => (
          <li key={item}>
            <Icon icon={CircleCheck} size={22} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NextCard({ project }: { project: Project }) {
  const { image, video } = project;
  return (
    <Link to={project.caseStudy!} className="cs-next-card">
      <div className="cs-next-preview" style={{ backgroundColor: project.tint, backgroundImage: image ? `url("${image}")` : undefined }}>
        {!image && video && <video src={video} muted playsInline preload="metadata" className="cs-next-video" />}
      </div>
      <div className="cs-next-meta">
        <div className="cs-next-meta-row">
          <p className="cs-next-company">
            {project.contextIcon && <img src={project.contextIcon} alt="" className="cs-next-company-icon" />}
            {project.context}
          </p>
          <Status project={project} />
        </div>
        <p className="cs-next-title">{project.title}</p>
      </div>
    </Link>
  );
}

/** The sign-off, then the next two case studies. */
export function BackLink() {
  const project = useProject();
  const studies = projects.filter((p) => p.caseStudy).reverse();
  const at = studies.findIndex((p) => p === project);
  const next = [1, 2].map((k) => studies[(at + k) % studies.length]).filter((p) => p && p !== project);

  return (
    <>
      <p className="cs-thanks">
        thanks for reading <span className="cs-thanks-kao">(•‿•)ノ</span>
      </p>
      {next.length > 0 && (
        <div className="cs-next">
          <p className="cs-section-label cs-section-label--grey">Up next</p>
          <div className="cs-next-grid">
            {next.map((p) => (
              <NextCard key={p.title} project={p} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
