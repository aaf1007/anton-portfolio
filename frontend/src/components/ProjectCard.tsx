import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ProjectCardProps = {
  title: string;
  description: ReactNode;
  image?: string | ReactNode;
  stack: string[];
  link?: string;
  github?: string;
  prod?: string;
  caseStudy?: string;
  inProgress: boolean;
};

export default function ProjectCard({
  title,
  description,
  image,
  stack,
  link,
  github,
  prod,
  caseStudy,
  inProgress,
}: ProjectCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-foreground/70 text-[0.95rem]">
          {inProgress && "In Progress"}
        </p>
      </div>

      {image && (
        <a href={link || github} target="_blank" rel="noreferrer">
          {typeof image === "string" ? (
            <img
              src={image}
              alt={title}
              className="w-full h-auto rounded object-cover opacity-95 hover:opacity-100 transition-opacity "
            />
          ) : (
            image
          )}
        </a>
      )}

      <div className="text-sm text-foreground/75 leading-relaxed">
        {description}
      </div>

      <div className="flex flex-wrap gap-2">
        {stack.map((item) => (
          <span
            key={item}
            className="text-xs text-primary/60 border border-primary/20 px-2 py-0.5 rounded"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="flex gap-5 text-sm text-foreground/60">
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors"
          >
            view demo ↗
          </a>
        )}
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors"
          >
            github ↗
          </a>
        )}
        {prod && (
          <a
            href={prod}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors"
          >
            view product ↗
          </a>
        )}
        {caseStudy && (
          <Link
            to={caseStudy}
            className="hover:text-primary transition-colors"
          >
            learn more →
          </Link>
        )}
      </div>
    </div>
  );
}
