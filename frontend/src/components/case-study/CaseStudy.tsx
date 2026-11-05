import { ProjectGrid } from "@/components/site/ProjectCard";
import { Gap } from "@/components/site/Section";
import { projects, type Project } from "@/data/portfolio";
import { delay } from "@/lib/stagger";
import { ArrowLeft, CircleAlert, CircleCheck, CircleX, Globe, Lightbulb, Wrench, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FaGithub } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./case-study.css";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function useProject() {
  const { pathname } = useLocation();
  return projects.find((p) => p.caseStudy === pathname);
}

const Icon = ({ icon: I, size = 18 }: { icon: LucideIcon; size?: number }) => (
  <I className="cs-icon" size={size} strokeWidth={1.75} aria-hidden />
);

/** Live, Building or Shipped, as on the project cards; an award as a gold chip. */
function Status({ project }: { project: Project }) {
  return (
    <>
      {project.award && <li className="cs-award">🏆 {project.award}</li>}
      {project.inProgress ? (
        <li className="s-status s-status--building">Building</li>
      ) : project.live ? (
        <li className="s-status">Live</li>
      ) : (
        <li className="s-status s-status--shipped">Shipped</li>
      )}
    </>
  );
}

/**
 * The page, inside the site shell: back link, hero image, header, then each
 * section ruled off from the next. Images marked .cs-expandable open big.
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
    <article
      className="cs"
      onClick={(e) => {
        const img = (e.target as HTMLElement).closest<HTMLImageElement>("img.cs-expandable");
        if (img) setZoom({ src: img.currentSrc || img.src, alt: img.alt });
      }}
    >
      {children}
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
    </article>
  );
}

/** On wide screens, the page's sections in the left margin; the one being read is lit. */
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
    <aside className="site cs-rail" aria-label="Case study sections">
      <p className="cs-rail-title">On this page</p>
      <nav className="cs-rail-nav">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className={`cs-rail-link${active === it.id ? " is-active" : ""}`}
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

/** ← Projects, the hero image, then where it was made, the title, its status, tags and links. */
export function Hero({ src, alt, title }: { src: string; alt: string; title: string }) {
  const project = useProject();

  return (
    <>
      {createPortal(<Rail />, document.body)}
      <div className="s-back s-rule-b s-in">
        <Link to="/projects">
          <ArrowLeft size={13} strokeWidth={2} />
          Projects
        </Link>
      </div>
      <Gap />
      <div className="cs-hero-media s-rule-b s-in" style={delay(1)}>
        <img src={src} alt={alt} className="cs-expandable" style={{ backgroundColor: project?.tint }} />
      </div>
      <header className="cs-head s-rule-b s-in" style={delay(2)}>
        {project && (
          <p className="cs-context">
            {project.contextIcon && <img src={project.contextIcon} alt="" aria-hidden />}
            {project.context}
            {project.dates && <span className="cs-dates">{project.dates}</span>}
          </p>
        )}
        <h1 className="s-h1">{project?.title ?? title}</h1>
        {project && (
          <div className="cs-head-row">
            <ul className="cs-badges">
              <Status project={project} />
              {project.stack.slice(0, 4).map((t) => (
                <li key={t} className="s-tag">
                  {t}
                </li>
              ))}
            </ul>
            <div className="s-card-links">
              {project.live && (
                <a href={project.live} {...ext} className="s-icon-btn" aria-label={`${project.title} live site`} title="Live site">
                  <Globe size={16} strokeWidth={1.8} />
                </a>
              )}
              {project.github && (
                <a href={project.github} {...ext} className="s-icon-btn" aria-label={`${project.title} on GitHub`} title="GitHub">
                  <FaGithub size={16} />
                </a>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

/** A chapter: a serif heading row (also its entry in the rail), ruled off, then its body. */
function Chapter({ id, label, children, order = 3 }: { id: string; label: string; children: ReactNode; order?: number }) {
  return (
    <>
      <Gap />
      <section id={id} data-toc={label} className="cs-section s-in" style={delay(order)}>
        <div className="s-head s-rule-b">
          <h2 className="s-h2">{label}</h2>
        </div>
        <div className="cs-body-wrap">{children}</div>
      </section>
    </>
  );
}

/** TL;DR: the pitch, then the key facts. */
export function Intro({ meta, children }: { meta: { label: string; value: string }[]; children: ReactNode }) {
  return (
    <Chapter id="tldr" label="TL;DR">
      <div className="cs-prose">{children}</div>
      <dl className="cs-meta">
        {meta.map((m) => (
          <div key={m.label} className="cs-meta-row">
            <dt>{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>
    </Chapter>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className="cs-lede">{children}</p>;
}

/** A chapter with an optional question-style heading under its label. */
export function Section({ eyebrow, heading, children }: { eyebrow: string; heading?: string; children: ReactNode }) {
  const label = eyebrow.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  return (
    <Chapter id={slug(eyebrow)} label={label} order={4}>
      {heading && <h3 className="cs-h2">{heading}</h3>}
      {children}
    </Chapter>
  );
}

/** A pain point, as a card. */
export function Beat({ title, body }: { title: string; body: ReactNode; glyph?: string }) {
  return (
    <div className="cs-card">
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
    <div className={tone === "muted" ? "cs-card cs-card--muted" : "cs-card"}>
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
        <h4 className="cs-h3">{title}</h4>
        <p className="cs-text">{body}</p>
        <img src={image} alt={alt} loading="lazy" className="cs-image cs-expandable" />
      </div>
    </div>
  );
}

/** A connecting line between two steps. */
export function Bridge({ children }: { children: ReactNode }) {
  return <p className="cs-bridge">{children}</p>;
}

/** A lesson or a next step: its title beside its body. */
export function Reflection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="cs-learning">
      <h4 className="cs-h3">
        <Icon icon={Lightbulb} />
        {title}
      </h4>
      <p className="cs-text">{children}</p>
    </div>
  );
}

export function ImpactList({ items }: { items: string[] }) {
  return (
    <ul className="cs-impact">
      {items.map((item) => (
        <li key={item}>
          <Icon icon={CircleCheck} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** The sign-off, then the next two case studies as project cards. */
export function BackLink() {
  const project = useProject();
  const studies = projects.filter((p) => p.caseStudy).reverse();
  const at = studies.findIndex((p) => p === project);
  const next = [1, 2].map((k) => studies[(at + k) % studies.length]).filter((p) => p && p !== project);

  return (
    <>
      <Gap />
      <p className="cs-thanks s-rule-b">Thanks for reading.</p>
      {next.length > 0 && (
        <>
          <Gap />
          <section aria-labelledby="up-next">
            <div className="s-head s-rule-b">
              <h2 id="up-next" className="s-h2">
                Up next
              </h2>
              <Link to="/projects" className="s-more">
                All projects
              </Link>
            </div>
            <ProjectGrid projects={next} />
          </section>
        </>
      )}
    </>
  );
}
