import type { ReactNode } from "react";

type ProjectCardProps = {
  title: string;
  description: ReactNode;
  image?: string;
  stack: string[];
  link?: string;
  github?: string;
};

export default function ProjectCard({
  title,
  description,
  image,
  stack,
  link,
  github,
}: ProjectCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-semibold text-foreground">{title}</p>

      {image && (
        <a href={link || github} target="_blank" rel="noreferrer">
          <img
            src={image}
            alt={title}
            className="w-full h-auto rounded object-cover opacity-95 hover:opacity-100 transition-opacity"
          />
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
            link ↗
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
      </div>
    </div>
  );
}
