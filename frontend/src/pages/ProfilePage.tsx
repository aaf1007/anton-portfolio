import { hobbies, learning } from "@/data/portfolio";
import { go } from "@/lib/go";
import { useRaster } from "@/lib/raster";
import { play } from "@/lib/sfx";
import "@/styles/profile.css";
import { useEffect, useRef, useState, type ReactNode } from "react";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

function Paperclip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 140" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="clip-metal" x1="0" x2="1">
          <stop offset="0" stopColor="#8c8f96" />
          <stop offset="0.5" stopColor="#f1f2f4" />
          <stop offset="1" stopColor="#8a8d94" />
        </linearGradient>
      </defs>
      {/* star charm */}
      <path
        d="M20 1.5l3.3 6.7 7.4 1.1-5.35 5.2 1.26 7.36L20 18.4l-6.6 3.46 1.26-7.36L9.3 9.3l7.4-1.1z"
        fill="url(#clip-metal)"
        stroke="#80838a"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path d="M24 38v82a8 8 0 0 1-16 0V30a12 12 0 0 1 24 0v88a4.5 4.5 0 0 1-9 0V38" stroke="url(#clip-metal)" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

type Side = "front" | "back";

// a paper flick each time a print comes forward, at most every 250ms
let lastFlick = 0;
function flick() {
  const now = performance.now();
  if (now - lastFlick > 250) {
    lastFlick = now;
    play("print");
  }
}

/** Two prints clipped together. Hovering one swings it to the front (a tap on touch screens). */
function Prints() {
  const [front, setFront] = useState<Side | null>(null);
  const [waiting, setWaiting] = useState(true);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const imgs = [...(box.current?.querySelectorAll("img") ?? [])];
    let done = false;
    const show = () => {
      if (!done) {
        done = true;
        setWaiting(false);
      }
    };
    void Promise.all(imgs.map((i) => i.decode().catch(() => {}))).then(show);
    const t = window.setTimeout(show, 1500);
    return () => clearTimeout(t);
  }, []);

  const bring = (side: Side) => {
    if (side === front) return;
    setFront(side);
    flick();
  };
  const hover = matchMedia("(hover: hover)").matches;

  return (
    <div
      ref={box}
      className={waiting ? "profile-prints is-waiting" : "profile-prints"}
      data-front={front ?? undefined}
      onMouseLeave={hover ? () => setFront(null) : undefined}
    >
      {(["front", "back"] as const).map((side) => (
        <figure
          key={side}
          className={`print is-${side}`}
          onMouseEnter={hover ? () => bring(side) : undefined}
          onClick={hover ? undefined : () => (front === side ? setFront(null) : bring(side))}
        >
          <span className="photo">
            {side === "front" ? (
              <img src="/about-me.jpg" alt="Anton in a grey sweater in front of a brick wall" decoding="async" draggable={false} />
            ) : (
              <img src="/about-sky.jpg" alt="Tennis courts under an evening sky" decoding="async" draggable={false} />
            )}
          </span>
        </figure>
      ))}
      <Paperclip className="clip" />
    </div>
  );
}

/** Letters that ripple up under the pointer. */
function Wave({ children }: { children: string }) {
  return (
    <span className="fact-wave">
      {children.split(" ").map((word, w) => (
        <span key={w}>
          {w > 0 && " "}
          <span className="fact-wave-word">
            {[...word].map((ch, i) => (
              <span key={i} className="fact-wave-letter">
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

function Fact({ file, children }: { file: string; children: ReactNode }) {
  return (
    <div className="txt-card fact-card">
      <div className="fact-footer">
        <span className="fact-filename">{file}</span>
      </div>
      <div className="fact-lines">
        <span className="fact-text">{children}</span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const heading = useRef<HTMLHeadingElement>(null);
  useRaster(heading);
  const internal = (to: string) => ({
    href: to,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      go(to);
    },
  });

  return (
    <div className="profile">
      <div className="profile-layout">
        <Prints />
        <div className="profile-scroll-col">
          <section className="profile-section">
            <h1 ref={heading} className="profile-heading">
              About me
            </h1>
            <p className="profile-body">
              I&rsquo;m a software developer drawn to the spot where web apps meet LLMs: practical AI tools you can actually use, from{" "}
              <a {...internal("/projects/verifai")}>browser extensions</a> and <a {...internal("/projects/careerconnect")}>matching engines</a>{" "}
              to{" "}
              <a href="https://syllabyss.tech" {...ext}>
                study games
              </a>{" "}
              built from your own notes.
            </p>
            <p className="profile-body">
              I study data science at{" "}
              <a href="https://www.sfu.ca/" {...ext}>
                Simon Fraser University
              </a>{" "}
              after two years of computer science at Douglas College. I won SFU Surge SillyHacks 2026 with{" "}
              <a {...internal("/projects/bscode")}>BSCode</a>, shipped Syllabyss at StormHacks 2026, and I&rsquo;m now building at SAP.
            </p>
          </section>
          <section className="profile-section">
            <div className="fact-list">
              <Fact file="exploring.txt">
                learning {learning.slice(0, -1).join(", ")}, and <Wave>{`${learning.at(-1)}!`}</Wave>
              </Fact>
              <Fact file="after-hours.txt">
                {hobbies.slice(0, -1).join(", ")} and {hobbies.at(-1)}.
              </Fact>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
