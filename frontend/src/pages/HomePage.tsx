import {
  hobbies,
  lifePhotos,
  projects,
  skills
} from "@/data/portfolio";
import { EASE_OUT, staggerContainer, useMotionVariants } from "@/lib/motion";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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
  return <h2 className="font-bold text-xl tracking-tight">{children}</h2>;
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center bg-background shadow-sm px-3 border ring-border/20 border-border rounded-xl ring-2 h-7 font-medium text-foreground text-xs">
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
      className="group flex flex-col bg-card border border-border rounded-xl hover:ring-2 hover:ring-muted h-full overflow-hidden transition-all duration-200"
    >
      <Link
        to={isExternal ? "#" : href}
        onClick={(event) => {
          if (isExternal) {
            event.preventDefault();
            window.open(href, "_blank", "noopener,noreferrer");
          }
        }}
        className="block relative bg-muted h-48 overflow-hidden"
      >
        {typeof project.image === "string" ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          project.image
        )}
        {project.inProgress && (
          <span className="top-2 right-2 absolute bg-black px-2 py-1 rounded-lg font-medium text-[11px] text-white">
            In Progress
          </span>
        )}
      </Link>
      <div className="flex flex-col flex-1 gap-3 p-6">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight">{project.title}</h3>
            <p className="mt-1 text-muted-foreground text-xs">{project.dates}</p>
          </div>
          <ArrowUpRight className="mt-0.5 size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
        </div>
        <p className="text-muted-foreground text-xs text-pretty leading-relaxed">
          {project.shortDescription}
        </p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {project.stack.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 border border-border rounded-md h-6 font-medium text-[11px] text-muted-foreground"
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
      className="flex flex-col gap-14 mx-auto pb-28 w-full max-w-2xl min-h-dvh"
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="show"
    >
      <section id="home" className="scroll-mt-20">
        <motion.div
          className="flex md:flex-row flex-col md:justify-between md:items-start gap-6"
          variants={item}
        >
          <div className="flex flex-col gap-2 order-2 md:order-1">
            <motion.h1
              className="font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tight"
              initial={{ opacity: 0, y: -8, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.42, ease: EASE_OUT, delay: BLUR_FADE_DELAY }}
            >
              Hi, I'm Anton
            </motion.h1>
            <motion.p
              className="max-w-[600px] text-muted-foreground md:text-lg lg:text-xl text-pretty"
              initial={{ opacity: 0, y: -8, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.42, ease: EASE_OUT, delay: BLUR_FADE_DELAY * 2 }}
            >
              Data Science student at SFU. Building full-stack applications,
              exploring AI/ML engineering, and shaping practical AI workflows.
            </motion.p>
          </div>
          <motion.div
            className="order-1 md:order-2 bg-muted shadow-lg border rounded-3xl ring-4 ring-muted size-24 md:size-32 overflow-hidden"
            initial={{ opacity: 0, y: -8, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.42, ease: EASE_OUT, delay: BLUR_FADE_DELAY }}
          >
            <img
              src="/pfp.jpeg"
              alt="Anton Florendo"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </section>

      {/*
      <motion.section id="about" className="space-y-4 scroll-mt-24" variants={item}>
        <SectionHeading>About</SectionHeading>
        <p className="text-muted-foreground text-pretty leading-relaxed">
          I'm focused on the overlap between software engineering and applied AI:
          products that turn messy user context into useful, grounded tools. Lately
          that has meant building browser extensions, internship matching systems,
          recipe generation apps, and ML experiments while studying Data Science at
          Simon Fraser University.
        </p>
      </motion.section>
      */}

      {/* <motion.section id="current" className="space-y-6 scroll-mt-24" variants={item}>
        <SectionHeading>Currently</SectionHeading>
        <div className="border-border border-y divide-y divide-border">
          <div className="sm:items-center gap-2 grid sm:grid-cols-[4rem_1fr] py-4">
            <span className="font-mono tabular-nums text-muted-foreground text-xs">
              01
            </span>
            <div className="sm:items-center gap-1 grid sm:grid-cols-[8rem_1fr]">
              <p className="font-semibold leading-snug">Exploring</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AI Engineering, RAG pipelines, and deep learning.
              </p>
            </div>
          </div>
          <div className="sm:items-center gap-2 grid sm:grid-cols-[4rem_1fr] py-4">
            <span className="font-mono tabular-nums text-muted-foreground text-xs">
              02
            </span>
            <div className="sm:items-center gap-1 grid sm:grid-cols-[8rem_1fr]">
              <p className="font-semibold leading-snug">Learning</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {learning.join(", ")}
              </p>
            </div>
          </div>
          <div className="sm:items-center gap-2 grid sm:grid-cols-[4rem_1fr] py-4">
            <span className="font-mono tabular-nums text-muted-foreground text-xs">
              03
            </span>
            <div className="sm:items-center gap-1 grid sm:grid-cols-[8rem_1fr] min-w-0">
              <p className="font-semibold leading-snug">Digesting</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 min-w-0">
                {digesting.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground text-sm hover:underline underline-offset-4 leading-relaxed transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section> */}

      <motion.section id="education" className="space-y-6 scroll-mt-24" variants={item}>
        <SectionHeading>Education</SectionHeading>
        <div className="flex flex-col gap-6">
          {education.map((item) => (
            <a
              key={item.school}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex justify-between items-center gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex justify-center items-center bg-white shadow-sm p-1.5 border ring-border/30 border-border rounded-xl ring-2 size-11 shrink-0">
                  <img
                    src={item.logo}
                    alt={`${item.school} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-semibold leading-none">
                    {item.school}
                    <ArrowUpRight className="opacity-0 group-hover:opacity-100 size-3.5 text-muted-foreground transition-all -translate-x-1 group-hover:translate-x-0 duration-200" />
                  </div>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {item.degree}
                  </p>
                </div>
              </div>
              <p className="tabular-nums text-muted-foreground text-xs text-right shrink-0">
                {item.dates}
              </p>
            </a>
          ))}
        </div>
      </motion.section>

      <motion.section id="skills" className="space-y-4 scroll-mt-24" variants={item}>
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
        <div className="flex flex-col gap-y-8 min-h-0">
          <div className="flex flex-col justify-center items-center gap-y-4">
            <div className="flex items-center w-full">
              <div className="flex-1 bg-linear-to-r from-5% from-transparent via-95% to-transparent via-border h-px" />
              <div className="z-10 bg-primary px-4 py-1 border rounded-xl">
                <span className="font-medium text-primary-foreground text-sm">
                  My Projects
                </span>
              </div>
              <div className="flex-1 bg-linear-to-l from-5% from-transparent via-95% to-transparent via-border h-px" />
            </div>
            <div className="flex flex-col justify-center items-center gap-y-3 text-center">
              <h2 className="font-bold text-3xl sm:text-4xl tracking-tight">
                Check out my latest work
              </h2>
            </div>
          </div>
          <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 mx-auto max-w-[800px]">
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

      <motion.section id="life" className="space-y-6 scroll-mt-24" variants={item}>
        <div className="flex justify-between items-end gap-4">
          <div>
            <SectionHeading>Life</SectionHeading>
            <p className="mt-2 text-muted-foreground text-sm">
              Outside the editor: {hobbies.join(", ")}.
            </p>
          </div>
          <Link
            to="/life"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            View all <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <div className="gap-2 grid grid-cols-3">
          {lifePhotos.slice(0, 6).map((photo) => (
            <img
              key={photo}
              src={photo}
              alt=""
              className="shadow-sm border rounded-xl object-cover aspect-square"
            />
          ))}
        </div>
      </motion.section>

      <motion.section id="contact" className="scroll-mt-24" variants={item}>
        <div className="relative px-6 sm:px-10 py-8 sm:py-10 border rounded-xl overflow-hidden text-center">
          <div className="top-0 absolute inset-x-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:18px_18px] opacity-30 h-1/2 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="relative flex flex-col items-center gap-3">
            <span className="font-medium text-muted-foreground text-xs">
              Contact
            </span>
            <h2 className="font-bold text-3xl sm:text-4xl tracking-tight">
              Get in touch
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground text-sm sm:text-base text-balance leading-relaxed">
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
