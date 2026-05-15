import { useMotionVariants } from "@/lib/motion";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

type ProjectCardProps = {
  title: string;
  description: ReactNode;
  shortDescription?: string;
  image?: string | ReactNode;
  stack: string[];
  link?: string;
  github?: string;
  prod?: string;
  caseStudy?: string;
  inProgress: boolean;
  dates?: string;
};

function CardLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

export default function ProjectCard({
  title,
  description,
  shortDescription,
  image,
  stack,
  link,
  github,
  prod,
  caseStudy,
  inProgress,
  dates,
}: ProjectCardProps) {
  const item = useMotionVariants();
  const primaryHref = link || prod || caseStudy || github || "#";

  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:ring-2 hover:ring-muted"
      variants={item}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {image && (
        <CardLink href={primaryHref} className="relative block h-52 overflow-hidden bg-muted">
          {typeof image === "string" ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            image
          )}
          {inProgress && (
            <span className="absolute right-2 top-2 rounded-lg bg-black px-2 py-1 text-[11px] font-medium text-white">
              In Progress
            </span>
          )}
        </CardLink>
      )}

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-semibold leading-tight text-foreground">{title}</h2>
            {dates && (
              <p className="mt-1 text-xs text-muted-foreground">{dates}</p>
            )}
          </div>
          <CardLink
            href={primaryHref}
            className="shrink-0 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="sr-only">Open {title}</span>
            <ArrowUpRight className="size-4" aria-hidden />
          </CardLink>
        </div>

        <div className="text-xs leading-relaxed text-muted-foreground">
          {shortDescription ? <p>{shortDescription}</p> : description}
        </div>

        <div className="mt-auto flex flex-wrap gap-1">
          {stack.map((item) => (
            <span
              key={item}
              className="inline-flex h-6 items-center rounded-md border border-border px-2 text-[11px] font-medium text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-1 text-xs font-medium text-muted-foreground">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Website
            </a>
          )}
          {prod && (
            <a
              href={prod}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Product
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Source
            </a>
          )}
          {caseStudy && (
            <Link to={caseStudy} className="transition-colors hover:text-foreground">
              Case study
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
