import type { Project } from "@/data/portfolio";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";

function ProjectLink({
  href,
  children,
  className,
  label,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} aria-label={label}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className} aria-label={label}>
      {children}
    </Link>
  );
}

function ProjectImage({ image, title, className }: { image: Project["image"]; title: string; className?: string }) {
  if (!image) return null;
  return typeof image === "string" ? (
    <img src={image} alt={title} loading="lazy" className={cn("size-full object-cover", className)} />
  ) : (
    image
  );
}

const linkClass =
  "relative z-10 text-muted-foreground underline decoration-faint underline-offset-4 transition-colors hover:text-foreground hover:decoration-signal";

function ProjectRow({
  project,
  number,
  onHover,
  headingLevel: Heading,
}: {
  project: Project;
  number: number;
  onHover: (p: Project | null) => void;
  headingLevel: "h2" | "h3";
}) {
  const { title, shortDescription, image, stack, live, github, caseStudy, inProgress, dates } = project;
  const primary = caseStudy || live || github;

  return (
    <li
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(project)}
      onPointerLeave={() => onHover(null)}
      className="group relative grid grid-cols-[2.25rem_minmax(0,1fr)_auto] gap-x-3 gap-y-2 border-b border-rule py-5 transition-colors hover:bg-muted lg:grid-cols-[3rem_minmax(0,1.15fr)_minmax(0,1.6fr)_minmax(0,0.9fr)_8.5rem] lg:gap-x-6 lg:py-4"
    >
      <span className="pt-0.5 pl-1 text-[11px] text-faint tabular-nums lg:pl-2">
        {String(number).padStart(2, "0")}
      </span>

      <div className="min-w-0">
        <Heading className="heading text-[15px] leading-snug text-foreground transition-transform duration-300 ease-out group-hover:translate-x-1.5 lg:text-base">
          {primary ? (
            <ProjectLink href={primary} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-signal">
              {title}
            </ProjectLink>
          ) : (
            title
          )}
          {primary && (
            <span
              aria-hidden
              className="ml-2 inline-block -translate-x-1 text-signal opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            >
              {primary.startsWith("http") ? "↗" : "→"}
            </span>
          )}
        </Heading>
        {inProgress && (
          <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-signal" /> in progress
          </span>
        )}
      </div>

      <span className="pt-0.5 text-right text-[11px] text-muted-foreground tabular-nums lg:order-last lg:pr-2">
        {dates}
      </span>

      <div className="col-span-2 col-start-2 min-w-0 space-y-3 text-[12.5px] leading-relaxed text-muted-foreground lg:col-span-1 lg:col-start-auto">
        <div className="text-pretty">{shortDescription}</div>
        {image && (
          <div className="halftone aspect-[16/9] overflow-hidden rounded-[6px] border border-rule bg-muted lg:hidden">
            <ProjectImage image={image} title={title} />
          </div>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11.5px]">
          {caseStudy && (
            <ProjectLink href={caseStudy} className={linkClass} label={`${title} case study`}>
              case study
            </ProjectLink>
          )}
          {live && (
            <ProjectLink href={live} className={linkClass} label={`${title} live site`}>
              live ↗
            </ProjectLink>
          )}
          {github && (
            <ProjectLink href={github} className={linkClass} label={`${title} source code`}>
              code ↗
            </ProjectLink>
          )}
        </div>
      </div>

      <p className="hidden text-[11.5px] leading-relaxed text-faint lg:block">
        {stack.slice(0, 4).join(" / ")}
        {stack.length > 4 && ` +${stack.length - 4}`}
      </p>
    </li>
  );
}

/**
 * Index-style list of projects. On desktop, hovering a row floats a preview
 * of the project next to the cursor.
 */
export default function ProjectList({
  projects,
  headingLevel = "h2",
  start = 1,
}: {
  projects: Project[];
  headingLevel?: "h2" | "h3";
  start?: number;
}) {
  const [hovered, setHovered] = useState<Project | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 380, damping: 34, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 380, damping: 34, mass: 0.6 });

  // scrolling moves rows out from under a still cursor without a pointerleave
  useEffect(() => {
    if (!hovered) return;
    const hide = () => setHovered(null);
    window.addEventListener("scroll", hide, { passive: true, once: true });
    return () => window.removeEventListener("scroll", hide);
  }, [hovered]);

  const onMove = (e: PointerEvent) => {
    x.set(e.clientX + 28);
    y.set(e.clientY - 110);
  };

  return (
    <div onPointerMove={onMove} className="relative">
      <ol className="border-t border-rule">
        {projects.map((project, i) => (
          <ProjectRow
            key={project.title}
            project={project}
            number={start + i}
            onHover={setHovered}
            headingLevel={headingLevel}
          />
        ))}
      </ol>

      <motion.div
        aria-hidden
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed top-0 left-0 z-30 hidden lg:block"
      >
        <AnimatePresence>
          {hovered?.image && (
            <motion.div
              key={hovered.title}
              initial={{ opacity: 0, scale: 0.92, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0% 0 0)" }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="absolute top-0 left-0 aspect-[16/10] w-[340px] overflow-hidden rounded-[8px] border border-rule bg-background shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)]"
            >
              <ProjectImage image={hovered.image} title="" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
