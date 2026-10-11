import AsciiImage from "@/components/ascii/AsciiImage";
import ProjectList from "@/components/ProjectList";
import { Label, PageTitle, Reveal } from "@/components/Typography";
import { useTheme } from "@/context/ThemeContext";
import { digesting, hobbies, learning, projects, skills } from "@/data/portfolio";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const latestFirst = [...projects].reverse();
const building = projects.filter((p) => p.inProgress);

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link">
      {children}
    </a>
  );
}

export default function HomePage() {
  const { hash } = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    if (!hash) return;
    const scrollToHash = () => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const frame = requestAnimationFrame(scrollToHash);
    const delayed = window.setTimeout(scrollToHash, 400);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(delayed);
    };
  }, [hash]);

  return (
    <div className="flex flex-col gap-28 sm:gap-36">
      {/* ---------------------------------------------------------------- hero */}
      <section
        id="home"
        className="grid scroll-mt-10 grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12"
      >
        <PageTitle className="md:col-span-2 lg:col-span-2">anton florendo</PageTitle>

        <Reveal
          delay={0.35}
          className="md:col-start-2 md:row-span-2 md:row-start-2 lg:col-start-3 lg:row-span-3 lg:row-start-1"
        >
          <figure className="mx-auto w-full max-w-[360px] md:ml-auto">
            <AsciiImage
              src="/pfp-cutout.webp"
              alt="Portrait of Anton, drawn in ASCII characters"
              className="aspect-[560/553] w-full text-foreground"
              cell={5}
              ink={theme === "dark" ? "light" : "dark"}
              fit="contain"
              minInk={0.12}
            />
            <figcaption className="mt-3 flex justify-between border-t border-rule pt-2 text-[11px] text-muted-foreground">
              <span>fig. 01 — me, in plain text</span>
              <span className="hidden sm:inline">hover to develop</span>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.25} className="md:col-start-1 md:row-start-2">
          <Label>tldr</Label>
          <p className="max-w-[46ch]">
            I&rsquo;m a data science student at SFU and a software developer at SAP. I build
            full-stack products and practical AI tools — from{" "}
            <Link to="/projects/verifai" className="link">
              browser extensions
            </Link>{" "}
            and{" "}
            <Link to="/projects/careerconnect" className="link">
              matching engines
            </Link>{" "}
            to <Ext href="https://syllabyss.tech">study games</Ext> built from your own notes.
          </p>
        </Reveal>

        <Reveal delay={0.35} className="md:col-start-1 md:row-start-3 lg:col-start-2">
          <Label>today</Label>
          <p className="max-w-[46ch]">
            Software developer at <Ext href="https://www.sap.com/">SAP</Ext> in Vancouver since
            September 2026, while studying data science at{" "}
            <Ext href="https://www.sfu.ca/">Simon Fraser University</Ext>. Most of my side work
            sits where web apps meet LLMs.
          </p>
        </Reveal>

        <Reveal delay={0.45} className="md:col-start-1 md:row-start-4 lg:col-start-3">
          <Label>yesterday</Label>
          <p className="max-w-[46ch]">
            Before SFU, I studied computer science at{" "}
            <Ext href="https://www.douglascollege.ca/">Douglas College</Ext> (2023–25). Won SFU
            Surge SillyHacks 2026 with{" "}
            <Link to="/projects/bscode" className="link">
              BSCode
            </Link>{" "}
            and shipped Syllabyss at StormHacks 2026.
          </p>
        </Reveal>

        <Reveal delay={0.55} className="md:col-start-2 md:row-start-4 lg:col-start-1">
          <Label>in the background</Label>
          <dl className="grid grid-cols-[6.5rem_1fr] gap-y-2">
            {building.length > 0 && (
              <>
                <dt className="text-muted-foreground">building</dt>
                <dd>
                  {building.map((p) => p.title).join(", ")}
                  <span className="ml-2 inline-block size-1.5 animate-pulse rounded-full bg-signal align-middle" />
                </dd>
              </>
            )}
            <dt className="text-muted-foreground">learning</dt>
            <dd>{learning.join(", ")}</dd>
            <dt className="text-muted-foreground">reading</dt>
            <dd className="space-y-0.5">
              {digesting.slice(0, 3).map((d) => (
                <a key={d.name} href={d.url} target="_blank" rel="noopener noreferrer" className="link block w-fit">
                  {d.name}
                </a>
              ))}
            </dd>
            <dt className="text-muted-foreground">off-screen</dt>
            <dd>{hobbies.join(", ")}</dd>
          </dl>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------------- work */}
      <section id="projects" className="scroll-mt-10">
        <Label
          right={
            <Link to="/projects" className="link text-muted-foreground">
              all {projects.length} projects →
            </Link>
          }
        >
          selected work
        </Label>
        <Reveal>
          <ProjectList projects={latestFirst.slice(0, 5)} headingLevel="h3" />
        </Reveal>
      </section>

      {/* ---------------------------------------------------------------- stack */}
      <section id="skills" className="grid scroll-mt-10 gap-x-12 gap-y-8 lg:grid-cols-3">
        <Reveal>
          <Label>toolbox</Label>
          <p className="max-w-[40ch] text-muted-foreground">
            What I reach for most. TypeScript and Python daily, Java and Swift when the project
            asks for it.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-2">
          <ul className="grid grid-cols-2 border-t border-l border-rule sm:grid-cols-4 lg:grid-cols-5">
            {skills.map(({ name, icon: Icon, color }) => (
              <li
                key={name}
                className="group flex items-center gap-2.5 border-r border-b border-rule px-3 py-3 text-[12px] transition-colors hover:bg-muted"
              >
                <Icon
                  aria-hidden
                  className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-[var(--brand)]"
                  style={{ "--brand": color ?? "var(--foreground)" } as React.CSSProperties}
                />
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------------- contact */}
      <section id="contact" className="scroll-mt-10 pb-10">
        <Label>contact</Label>
        <Reveal className="grid gap-10 pt-6 lg:grid-cols-3">
          <h2 className="display text-[clamp(2.6rem,7vw,6.5rem)] lg:col-span-2">
            say hi<span className="text-signal">.</span>
          </h2>
          <div className="flex flex-col justify-end gap-5">
            <p className="max-w-[40ch] text-muted-foreground">
              Building something, hiring for an internship, or want to compare notes on AI tooling?
              Send me a message.
            </p>
            <ul className="border-t border-rule">
              {[
                { label: "linkedin", value: "/in/antonflorendo", href: "https://www.linkedin.com/in/antonflorendo/" },
                { label: "github", value: "@aaf1007", href: "https://github.com/aaf1007" },
                { label: "resume", value: "pdf, one page", href: "/resume" },
              ].map((c) => (
                <li key={c.label}>
                  <Link
                    to={c.href}
                    {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center justify-between border-b border-rule py-3 transition-colors hover:bg-muted"
                  >
                    <span className="pl-1 text-muted-foreground">{c.label}</span>
                    <span className="flex items-center gap-2 pr-1">
                      {c.value}
                      <span className="text-signal transition-transform duration-300 group-hover:translate-x-1">
                        {c.href.startsWith("http") ? "↗" : "→"}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
