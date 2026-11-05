import { education, experience } from "@/data/portfolio";
import { ChevronDown } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

type Item = {
  key: string;
  logo?: string;
  org: string;
  role: string;
  dates?: string;
  details?: ReactNode;
};

const items: Item[] = [
  ...experience.map((job) => ({
    key: `${job.org}-${job.dates}`,
    logo: job.logo,
    org: job.org,
    role: job.role,
    dates: job.dates,
    details: (
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
    ),
  })),
  ...education.map((ed) => ({
    key: ed.school,
    logo: ed.logo,
    org: ed.school,
    role: ed.program,
    dates: ed.note,
  })),
];

function Entry({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const panel = useId();
  const body = (
    <>
      <span className="s-mini-logo">{item.logo ? <img src={item.logo} alt="" /> : item.org[0]}</span>
      <span className="s-mini-text">
        <span className="s-mini-org">{item.org}</span>
        <span className="s-mini-role">{item.role}</span>
      </span>
      {item.dates && <span className="s-mini-dates">{item.dates}</span>}
      {item.details && <ChevronDown className="s-xp-chev" size={16} strokeWidth={1.8} />}
    </>
  );
  return (
    <li className="s-mini-row">
      {item.details ? (
        <>
          <button type="button" className="s-mini-btn" aria-expanded={open} aria-controls={panel} onClick={() => setOpen((o) => !o)}>
            {body}
          </button>
          <div id={panel} className={open ? "s-xp-panel is-open" : "s-xp-panel"} inert={!open}>
            <div className="s-mini-details">{item.details}</div>
          </div>
        </>
      ) : (
        <div className="s-mini-btn">{body}</div>
      )}
    </li>
  );
}

/** Home's short version of the experience page: work, then school, one line each. */
export default function HomeExperience() {
  return (
    <ul className="s-mini">
      {items.map((item) => (
        <Entry key={item.key} item={item} />
      ))}
    </ul>
  );
}
