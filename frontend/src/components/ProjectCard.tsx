import { useMotionVariants } from "@/lib/motion";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ProjectCardProps = {
  title: string;
  description: ReactNode;
  shortDescription?: ReactNode;
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
      className="group flex flex-col bg-card border border-border rounded-xl hover:ring-2 hover:ring-muted h-full overflow-hidden transition-all duration-200"
      variants={item}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {image && (
        <CardLink href={primaryHref} className="block relative bg-muted h-52 overflow-hidden">
          {typeof image === "string" ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            image
          )}
          {inProgress && (
            <span className="top-2 right-2 absolute bg-black px-2 py-1 rounded-lg font-medium text-[11px] text-white">
              In Progress
            </span>
          )}
        </CardLink>
      )}

      <div className="flex flex-col flex-1 gap-3 p-6">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h2 className="font-semibold text-foreground leading-tight">{title}</h2>
            {dates && (
              <p className="mt-1 text-muted-foreground text-xs">{dates}</p>
            )}
          </div>
          <CardLink
            href={primaryHref}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <span className="sr-only">Open {title}</span>
            <ArrowUpRight className="size-4" aria-hidden />
          </CardLink>
        </div>

        <div className="text-muted-foreground text-xs leading-relaxed">
          {shortDescription ? <p>{shortDescription}</p> : description}
        </div>

        <div className="flex flex-wrap gap-1 mt-auto">
          {stack.map((item) => (
            <span
              key={item}
              className="inline-flex items-center px-2 border border-border rounded-md h-6 font-medium text-[11px] text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-1 font-medium text-muted-foreground text-xs">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Website
            </a>
          )}
          {prod && (
            <a
              href={prod}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Product
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Source
            </a>
          )}
          {caseStudy && (
            <Link to={caseStudy} className="hover:text-foreground transition-colors">
              Case study
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
