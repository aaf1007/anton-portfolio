import type { Project } from "@/data/portfolio";
import { EASE_OUT, fadeIn } from "@/lib/motion";
import { BookOpen, Globe } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { SiGithub } from "react-icons/si";
import { Link } from "react-router-dom";

type ProjectCardProps = Project & {
  headingLevel?: "h2" | "h3";
  index?: number;
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

const pillClass =
  "inline-flex items-center gap-1.5 px-2.5 border border-border rounded-md h-7 font-medium text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors";

export default function ProjectCard({
  title,
  shortDescription,
  image,
  stack,
  live,
  github,
  caseStudy,
  inProgress,
  dates,
  headingLevel: Heading = "h2",
  index = 0,
}: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  // Right-hand card of each row (odd index) trails slightly for a stagger.
  const reveal: Variants = reduceMotion
    ? fadeIn
    : {
        hidden: { opacity: 0, y: 32 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.55,
            ease: EASE_OUT,
            delay: (index % 2) * 0.12,
          },
        },
      };
  const imageHref = caseStudy || live || github;
  const imageContent = image && (
    <>
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
    </>
  );
  const imageClass = "block relative bg-muted h-52 overflow-hidden";

  return (
    <motion.article
      className="group flex flex-col bg-card border border-border rounded-xl hover:ring-2 hover:ring-muted h-full overflow-hidden transition-all duration-200"
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {image &&
        (imageHref ? (
          <CardLink href={imageHref} className={imageClass}>
            {imageContent}
          </CardLink>
        ) : (
          <div className={imageClass}>{imageContent}</div>
        ))}

      <div className="flex flex-col flex-1 gap-3 p-6">
        <div className="min-w-0">
          <Heading className="font-semibold text-foreground leading-tight">{title}</Heading>
          {dates && <p className="mt-1 text-muted-foreground text-xs">{dates}</p>}
        </div>

        <p className="text-muted-foreground text-xs text-pretty leading-relaxed">
          {shortDescription}
        </p>

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

        {(caseStudy || live || github) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {caseStudy && (
              <Link to={caseStudy} className={pillClass}>
                <BookOpen className="size-3.5" aria-hidden />
                Read more
              </Link>
            )}
            {live && (
              <a href={live} target="_blank" rel="noreferrer" className={pillClass}>
                <Globe className="size-3.5" aria-hidden />
                Live
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noreferrer" className={pillClass}>
                <SiGithub className="size-3.5" aria-hidden />
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
