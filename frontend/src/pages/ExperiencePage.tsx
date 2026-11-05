import { Gap, PageHead } from "@/components/site/Section";
import { delay } from "@/lib/stagger";
import { education, experience, projects } from "@/data/portfolio";
import { Briefcase, ChevronDown, ExternalLink, GraduationCap, Trophy, type LucideIcon } from "lucide-react";
import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

/** One line in a group: an icon, a title and its meta; opens to its details when it has any. */
function Row({
  icon: Icon,
  tone,
  title,
  meta,
  href,
  internal,
  children,
}: {
  icon: LucideIcon;
  tone?: string;
  title: string;
  meta?: string;
  href?: string;
  internal?: boolean;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panel = useId();
  const link =
    href &&
    (internal ? (
      <Link to={href} className="s-xp-ext" aria-label={`Open ${title}`} onClick={(e) => e.stopPropagation()}>
        <ExternalLink size={13} strokeWidth={1.8} />
      </Link>
    ) : (
      <a href={href} {...ext} className="s-xp-ext" aria-label={`Open ${title}`} onClick={(e) => e.stopPropagation()}>
        <ExternalLink size={13} strokeWidth={1.8} />
      </a>
    ));
  return (
    <div className="s-xp-row">
      <div
        className="s-xp-btn"
        role={children ? "button" : undefined}
        tabIndex={children ? 0 : undefined}
        aria-expanded={children ? open : undefined}
        aria-controls={children ? panel : undefined}
        onClick={children ? () => setOpen((o) => !o) : undefined}
        onKeyDown={
          children
            ? (e) => {
                if (e.target !== e.currentTarget) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen((o) => !o);
                }
              }
            : undefined
        }
        style={{ cursor: children ? "pointer" : "default" }}
      >
        <Icon className="s-xp-icon" size={18} strokeWidth={1.8} style={tone ? ({ "--tone": tone } as CSSProperties) : undefined} />
        <span>
          <span className="s-xp-title">{title}</span>
          {meta && <span className="s-xp-meta">{meta}</span>}
          {link}
        </span>
        {children && <ChevronDown className="s-xp-chev" size={18} strokeWidth={1.8} />}
      </div>
      {children && (
        <div id={panel} className={open ? "s-xp-panel is-open" : "s-xp-panel"} inert={!open}>
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}

function Group({ name, logo, url, children }: { name: string; logo?: string; url?: string; children: ReactNode }) {
  const heading = (
    <>
      {logo && <img src={logo} alt="" aria-hidden />}
      <h2>{name}</h2>
    </>
  );
  return (
    <div className="s-xp-group">
      {url ? (
        <a href={url} {...ext} className="s-xp-org">
          {heading}
        </a>
      ) : (
        <div className="s-xp-org">{heading}</div>
      )}
      {children}
    </div>
  );
}

const Label = ({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) => (
  <p className="s-xp-label">
    <Icon size={15} strokeWidth={1.8} aria-hidden />
    {children}
  </p>
);

const hackathons = [...projects].reverse().filter((p) => /hack/i.test(p.context));

export default function ExperiencePage() {
  return (
    <>
      <PageHead
        title="Experience"
        lede="Where I've worked, studied and competed: shipping at SAP, data science at SFU, and building things against the clock at hackathons."
      />
      <Gap />
      <div className="s-xp s-in" style={delay(2)}>
        {experience.length > 0 && (
          <>
            <Label icon={Briefcase}>Work</Label>
            {experience.map((job) => (
              <Group key={`${job.org}-${job.dates}`} name={job.org} logo={job.logo} url={job.url}>
                <Row icon={Briefcase} tone="var(--s-live)" title={job.role} meta={`${job.dates} · ${job.location}`}>
                  <ul className="s-xp-points">
                    {job.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                    <li className="s-xp-tagrow">
                      <ul className="s-tags">
                        {job.stack.map((t) => (
                          <li key={t} className="s-tag" style={{ listStyle: "none" }}>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </Row>
              </Group>
            ))}
          </>
        )}

        <Label icon={GraduationCap}>Education</Label>
        {education.map((ed) => (
          <Group key={ed.school} name={ed.school} logo={ed.logo} url={ed.url}>
            <Row icon={GraduationCap} tone="#8e8eff" title={ed.program} meta={ed.note} />
          </Group>
        ))}

        {hackathons.length > 0 && (
          <>
            <Label icon={Trophy}>Hackathons</Label>
            {hackathons.map((p) => (
              <Group key={p.title} name={p.context} logo={p.contextIcon}>
                <Row
                  icon={Trophy}
                  tone={p.award ? "var(--s-ribbon)" : "var(--s-muted)"}
                  title={p.title}
                  meta={[p.award && `🏆 ${p.award}`, p.dates].filter(Boolean).join(" · ")}
                  href={p.caseStudy ?? p.live ?? p.github}
                  internal={!!p.caseStudy}
                >
                  <ul className="s-xp-points">
                    <li>{p.shortDescription}</li>
                    <li className="s-xp-tagrow">
                      <ul className="s-tags">
                        {p.stack.map((t) => (
                          <li key={t} className="s-tag" style={{ listStyle: "none" }}>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </Row>
              </Group>
            ))}
          </>
        )}
      </div>
    </>
  );
}
