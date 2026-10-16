import Tamagotchi from "@/components/tamagotchi/Tamagotchi";
import "@/components/tamagotchi/home.css";
import { experience } from "@/data/portfolio";
import { useEffect, useState } from "react";

const now = experience.find((e) => e.current);

function Now() {
  if (!now) return null;
  return (
    <a href={now.url} target="_blank" rel="noopener noreferrer" className="handle">
      @{now.org.toLowerCase()}
    </a>
  );
}

/**
 * One line read across the tamagotchi: "I build for [toy] curiosity."
 * The words wait for the fonts, then rise in; the toy drops onto its keychain.
 */
export default function HomePage() {
  const [ready, setReady] = useState(() => document.documentElement.classList.contains("welcome-played"));

  useEffect(() => {
    if (ready) return;
    let live = true;
    const go = () => live && setReady(true);
    void document.fonts.ready.then(go);
    const t = window.setTimeout(go, 2000);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [ready]);

  return (
    <section className={`welcome${ready ? " home-ready" : ""}`}>
      <h1 className="sr-only">Anton Florendo, software developer. I build for curiosity.</h1>
      <div className="welcome-col">
        <div className="welcome-row">
          <div className="poster-left">
            <p className="poster-hello" aria-hidden>
              hey there,
            </p>
            <p className="poster-big poster-big--sans" aria-hidden>
              I build for
            </p>
            <p className="poster-sub">software developer</p>
            {/* stacked, the two captions merge into one line under the headline */}
            <p className="poster-sub poster-sub--merged">
              software developer{now && <> · intern <Now /></>}
            </p>
          </div>
          <div className="poster-right">
            <p className="poster-big poster-big--serif" aria-hidden>
              curiosity.
            </p>
            {now && (
              <p className="poster-sub">
                currently: intern <Now />
              </p>
            )}
          </div>
          <Tamagotchi />
        </div>
      </div>
    </section>
  );
}
