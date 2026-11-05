/**
 * GitHub Activity, ported from SpaceUI's component of the same name
 * (https://www.spaceui.one/components/github-activity, MIT, by Adriel Zimbril):
 * the header with the account and its yearly total, the 52-week contribution
 * matrix that scales in week by week, a tooltip per day and the legend.
 *
 * Changes from the original: plain CSS (site.css, `.gh-*`) instead of its
 * shadcn primitives, one shared tooltip instead of one per cell, user
 * accounts only, and an honest empty grid instead of random demo data when
 * the contributions can't be fetched.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { FaGithub } from "react-icons/fa";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type Activity = { total: number; weeks: Day[][] };

const cache = new Map<string, Activity>();

/** Contributions for the last year, from jogruber's public GitHub contributions API (as SpaceUI uses). */
function useContributions(user: string) {
  const [data, setData] = useState<Activity | null>(() => cache.get(user) ?? null);
  const [state, setState] = useState<"loading" | "ready" | "error">(() => (cache.has(user) ? "ready" : "loading"));

  useEffect(() => {
    if (cache.has(user)) return;
    const controller = new AbortController();
    fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=last`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json() as Promise<{ total?: { lastYear?: number }; contributions: { date: string; count: number; level: number }[] }>;
      })
      .then((json) => {
        const weeks: Day[][] = [];
        for (let i = 0; i < json.contributions.length; i += 7) {
          weeks.push(
            json.contributions.slice(i, i + 7).map((d) => ({ date: d.date, count: d.count, level: Math.min(4, Math.max(0, d.level)) as Day["level"] })),
          );
        }
        const total = json.total?.lastYear ?? json.contributions.reduce((n, d) => n + d.count, 0);
        const activity = { total, weeks };
        cache.set(user, activity);
        setData(activity);
        setState("ready");
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setState("error");
      });
    return () => controller.abort();
  }, [user]);

  return { data, state };
}

/** 53 empty weeks ending today, for the loading pulse and the error state. */
function blankYear(): Activity {
  const weeks: Day[][] = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() - 52 * 7);
  for (let w = 0; w < 53; w++) {
    const week: Day[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      week.push({ date: date.toISOString().slice(0, 10), count: 0, level: 0 });
    }
    weeks.push(week);
  }
  return { total: 0, weeks };
}

const fmt = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
};

export default function GitHubActivity({ user, subtitle = "Past 52 weeks" }: { user: string; subtitle?: string }) {
  const { data, state } = useContributions(user);
  const shown = useMemo(() => data ?? blankYear(), [data]);
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; day: Day } | null>(null);

  const months = useMemo(() => {
    const out: { label: string; at: number }[] = [];
    let current = -1;
    shown.weeks.forEach((week, i) => {
      const first = week[0];
      if (!first) return;
      const month = Number(first.date.slice(5, 7)) - 1;
      if (month !== current) {
        current = month;
        out.push({ label: new Date(2000, month, 1).toLocaleDateString("en-US", { month: "short" }), at: i + 1 });
      }
    });
    // a label squeezed against the left edge by a partial month reads as clutter
    if (out.length > 1 && out[1].at - out[0].at < 3) out.shift();
    return out;
  }, [shown]);

  // on phones the graph scrolls sideways: start at the latest week
  useEffect(() => {
    const el = scroller.current;
    if (el && matchMedia("(max-width: 767px)").matches) el.scrollLeft = el.scrollWidth;
  }, [shown]);

  const showTip = (e: React.MouseEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-i]");
    const box = root.current;
    if (!cell || !box || state !== "ready") return setTip(null);
    const [w, d] = cell.dataset.i!.split(":").map(Number);
    const c = cell.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    setTip({ x: c.left - b.left + c.width / 2, y: c.top - b.top, day: shown.weeks[w][d] });
  };

  const unit = (n: number) => (n === 1 ? "contribution" : "contributions");

  return (
    <div ref={root} className={state === "loading" ? "gh is-loading" : "gh"}>
      <div className="gh-head">
        <div className="gh-who">
          <span className="gh-badge" aria-hidden>
            <FaGithub size={24} />
          </span>
          <div>
            <a href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer" className="gh-name">
              @{user}
            </a>
            <p className="gh-sub">{subtitle}</p>
          </div>
        </div>
        <div className="gh-total">
          {state === "loading" ? (
            <span className="gh-count-skel" aria-label="Loading" />
          ) : (
            <span className="gh-count">{state === "error" ? "–" : shown.total.toLocaleString()}</span>
          )}
          <p className="gh-unit">contributions</p>
        </div>
      </div>

      <div ref={scroller} className="gh-scroll" style={{ "--weeks": shown.weeks.length } as CSSProperties}>
        <div className="gh-months" aria-hidden>
          {months.map((m) => (
            <span key={`${m.label}-${m.at}`} style={{ "--at": m.at } as CSSProperties}>
              {m.label}
            </span>
          ))}
        </div>
        <div className="gh-matrix" onMouseOver={showTip} onMouseLeave={() => setTip(null)}>
          <div className="gh-days" aria-hidden>
            <span />
            <span>Mon</span>
            <span />
            <span>Wed</span>
            <span />
            <span>Fri</span>
            <span />
          </div>
          <div
            className="gh-weeks"
            role="img"
            aria-label={state === "ready" ? `${shown.total} contributions on GitHub in the last year` : "GitHub contribution graph"}
          >
            {shown.weeks.map((week, w) => (
              <div key={w} className="gh-week" style={{ "--w": w } as CSSProperties}>
                {week.map((day, d) => (
                  <div key={day.date} className="gh-cell" data-l={day.level} data-i={`${w}:${d}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="gh-foot">
        {state === "error" && <span>Couldn&rsquo;t load activity right now.</span>}
        <div className="gh-legend" aria-hidden>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="gh-cell" data-l={l} />
          ))}
          <span>More</span>
        </div>
      </div>

      {tip && (
        <div className="gh-tip" style={{ left: tip.x, top: tip.y }} role="tooltip">
          <b>
            {tip.day.count} {unit(tip.day.count)}
          </b>
          <span>{fmt(tip.day.date)}</span>
        </div>
      )}
    </div>
  );
}
