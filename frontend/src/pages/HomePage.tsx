import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import StackIcon from "tech-stack-icons";

const coursework = [
  "Intro to Artificial Intelligence",
  "Intro to Software Engineering",
  "Linear Algebra",
  "Business Statistics",
];

const hobbies = ["gym", "cooking", "eating", "coding"];

const stack = [
  "typescript",
  "java",
  "python",
  "react",
  "nextjs",
  "spring",
  "tailwindcss",
];

const learning = ["springboot", "express", "machine learning"];

export default function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el =
          hash === "#contact"
            ? document.getElementById("contact")
            : hash === "#home"
            ? document.getElementById("home")
            : null;
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    return () => cancelAnimationFrame(id);
  }, [hash]);

  return (
    <div id="home" className="flex flex-col gap-12 pb-20">
      {/* Intro */}
      <section>
        <h1 className="text-2xl font-semibold mb-3 text-foreground">
          hi, i'm Anton.
        </h1>
        <p className="text-foreground/75 leading-relaxed">
          I'm a Data Science student at SFU who builds full-stack web apps and
          has recently gotten into AI/ML. Outside of coding I play tennis,
          basketball, and spend way too much time at the gym. I also love
          listening to music and watching movies.
        </p>
      </section>

      {/* Currently Focused On */}
      <section className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-widest text-primary/50 mb-2">
          currently...
        </p>
        <p className="text-foreground/75 leading-relaxed">
          Building full-stack applications, exploring AI/ML, and diving into
          distributed systems. I care about building things that solve real
          problems.
        </p>
        <p className="text-foreground/75">
          <span className="font-medium">Learning </span>
          {learning.join(", ")}
        </p>
      </section>

      {/* Coursework + Hobbies */}
      <section className="flex gap-14 flex-wrap">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary/50 mb-2">
            coursework
          </p>
          <ul className="space-y-1 text-foreground/75">
            {coursework.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary/50 mb-2">
            hobbies
          </p>
          <ul className="space-y-1 text-foreground/75">
            {hobbies.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <p className="text-xs font-medium uppercase tracking-widest text-primary/50 mb-3">
          tech stack
        </p>
        <div className="flex gap-3 flex-wrap">
          {stack.map((name) => (
            <StackIcon key={name} name={name} className="w-9 h-9" />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
