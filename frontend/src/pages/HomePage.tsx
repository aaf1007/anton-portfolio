import {
  digesting,
  hobbies,
  learning,
  lifePhotos,
  projects,
  skills,
} from "@/data/portfolio";
import { EASE_OUT, staggerContainer, useMotionVariants } from "@/lib/motion";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import type { ReactNode } from "react";

const BLUR_FADE_DELAY = 0.04;

const education = [
  {
    school: "Simon Fraser University",
    href: "https://www.sfu.ca/",
    degree: "Data Science",
    logo: "/sfu-logo.svg",
    dates: "2025 - Present",
  },
  {
    school: "Douglas College",
    href: "https://www.douglascollege.ca/",
    degree: "Computer Science",
    logo: "/douglas-college-logo.svg",
    dates: "2023 - 2025",
  },
];

function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-bold tracking-tight">{children}</h2>;
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground shadow-sm ring-2 ring-border/20">
      {children}
    </span>
  );
}

function ProjectShowcaseCard({
  project,
  delay,
}: {
  project: (typeof projects)[number];
  delay: number;
}) {
  const href = project.link || project.prod || project.caseStudy || project.github || "#";
  const isExternal = href.startsWith("http");

  return (
    <motion.article
      variants={useMotionVariants()}
      transition={{ delay }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:ring-2 hover:ring-muted"
    >
      <Link
        to={isExternal ? "#" : href}
        onClick={(event) => {
          if (isExternal) {
            event.preventDefault();
            window.open(href, "_blank", "noopener,noreferrer");
          }
        }}
        className="relative block h-48 overflow-hidden bg-muted"
      >
        {typeof project.image === "string" ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          project.image
        )}
        {project.inProgress && (
          <span className="absolute right-2 top-2 rounded-lg bg-black px-2 py-1 text-[11px] font-medium text-white">
            In Progress
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight">{project.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{project.dates}</p>
          </div>
          <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
        </div>
        <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
          {project.shortDescription}
        </p>
        <div className="mt-auto flex flex-wrap gap-1">
          {project.stack.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="inline-flex h-6 items-center rounded-md border border-border px-2 text-[11px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function HomePage() {
  const { hash } = useLocation();
  const item = useMotionVariants();

  useEffect(() => {
    if (!hash) return;
    const scrollToHash = () => {
      document.querySelector(hash)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };
    const frame = requestAnimationFrame(scrollToHash);
    const delayed = window.setTimeout(scrollToHash, 400);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(delayed);
    };
  }, [hash]);

  return (
    <motion.main
      className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-14 pb-28"
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="show"
    >
      <section id="home" className="scroll-mt-20">
        <motion.div
          className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between"
          variants={item}
        >
          <div className="order-2 flex flex-col gap-2 md:order-1">
            <motion.h1
              className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: -8, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.42, ease: EASE_OUT, delay: BLUR_FADE_DELAY }}
            >
              Hi, I'm Anton
            </motion.h1>
            <motion.p
              className="max-w-[600px] text-pretty text-muted-foreground md:text-lg lg:text-xl"
              initial={{ opacity: 0, y: -8, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.42, ease: EASE_OUT, delay: BLUR_FADE_DELAY * 2 }}
            >
              Data Science student at SFU. Building full-stack applications,
              exploring AI/ML engineering, and shaping practical AI workflows.
            </motion.p>
          </div>
          <motion.div
            className="order-1 size-24 overflow-hidden rounded-3xl border bg-muted shadow-lg ring-4 ring-muted md:order-2 md:size-32"
            initial={{ opacity: 0, y: -8, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.42, ease: EASE_OUT, delay: BLUR_FADE_DELAY }}
          >
            <img
              src="/pfp.jpeg"
              alt="Anton Florendo"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </motion.div>
      </section>

      {/*
      <motion.section id="about" className="scroll-mt-24 space-y-4" variants={item}>
        <SectionHeading>About</SectionHeading>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          I'm focused on the overlap between software engineering and applied AI:
          products that turn messy user context into useful, grounded tools. Lately
          that has meant building browser extensions, internship matching systems,
          recipe generation apps, and ML experiments while studying Data Science at
          Simon Fraser University.
        </p>
      </motion.section>
      */}

      <motion.section id="current" className="scroll-mt-24 space-y-6" variants={item}>
        <SectionHeading>Currently</SectionHeading>
        <div className="divide-y divide-border border-y border-border">
          <div className="grid gap-2 py-4 sm:grid-cols-[4rem_1fr] sm:items-center">
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              01
            </span>
            <div className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:items-center">
              <p className="font-semibold leading-snug">Exploring</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                AI Engineering, RAG pipelines, and deep learning.
              </p>
            </div>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[4rem_1fr] sm:items-center">
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              02
            </span>
            <div className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:items-center">
              <p className="font-semibold leading-snug">Learning</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {learning.join(", ")}
              </p>
            </div>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[4rem_1fr] sm:items-center">
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              03
            </span>
            <div className="grid min-w-0 gap-1 sm:grid-cols-[8rem_1fr] sm:items-center">
              <p className="font-semibold leading-snug">Digesting</p>
              <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1">
                {digesting.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm leading-relaxed text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section id="education" className="scroll-mt-24 space-y-6" variants={item}>
        <SectionHeading>Education</SectionHeading>
        <div className="flex flex-col gap-6">
          {education.map((item) => (
            <a
              key={item.school}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white p-1.5 shadow-sm ring-2 ring-border/30">
                  <img
                    src={item.logo}
                    alt={`${item.school} logo`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-semibold leading-none">
                    {item.school}
                    <ArrowUpRight className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.degree}
                  </p>
                </div>
              </div>
              <p className="shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {item.dates}
              </p>
            </a>
          ))}
        </div>
      </motion.section>

      <motion.section id="skills" className="scroll-mt-24 space-y-4" variants={item}>
        <SectionHeading>Skills</SectionHeading>
        <div className="flex flex-wrap gap-2">
          {skills.map(({ name, icon: Icon, color }) => (
            <Badge key={name}>
              <Icon className="mr-2 size-4" style={color ? { color } : undefined} />
              {name}
            </Badge>
          ))}
        </div>
      </motion.section>

      <motion.section id="projects" className="scroll-mt-24" variants={item}>
        <div className="flex min-h-0 flex-col gap-y-8">
          <div className="flex flex-col items-center justify-center gap-y-4">
            <div className="flex w-full items-center">
              <div className="h-px flex-1 bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
              <div className="z-10 rounded-xl border bg-primary px-4 py-1">
                <span className="text-sm font-medium text-primary-foreground">
                  My Projects
                </span>
              </div>
              <div className="h-px flex-1 bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
            </div>
            <div className="flex flex-col items-center justify-center gap-y-3 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Check out my latest work
              </h2>
            </div>
          </div>
          <div className="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2">
            {[...projects].reverse().map((project, id) => (
              <ProjectShowcaseCard
                key={project.title}
                project={project}
                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              />
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section id="life" className="scroll-mt-24 space-y-6" variants={item}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <SectionHeading>Life</SectionHeading>
            <p className="mt-2 text-sm text-muted-foreground">
              Outside the editor: {hobbies.join(", ")}.
            </p>
          </div>
          <Link
            to="/life"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {lifePhotos.slice(0, 6).map((photo) => (
            <img
              key={photo}
              src={photo}
              alt=""
              className="aspect-square rounded-xl border object-cover shadow-sm"
            />
          ))}
        </div>
      </motion.section>

      <motion.section id="contact" className="scroll-mt-24" variants={item}>
        <div className="relative overflow-hidden rounded-xl border px-6 py-8 text-center sm:px-10 sm:py-10">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:18px_18px] opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="relative flex flex-col items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">
              Contact
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get in touch
            </h2>
            <p className="mx-auto max-w-lg text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
              Want to build something, talk AI workflows, or compare notes on a
              project? Reach me on{" "}
              <a
                href="https://www.linkedin.com/in/antonflorendo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                LinkedIn
              </a>{" "}
              or{" "}
              <a
                href="https://github.com/aaf1007"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
}
