import type { ReactNode } from "react";
import { RiExternalLinkLine, RiGithubLine } from "react-icons/ri";

export type ProjectCardProps = {
  title: string;
  description: ReactNode;
  image: string;
  stack: string[];
  link?: string;
  github?: string;
};

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
      {children}
    </a>
  );
}

export default function ProjectCard({
  title,
  description,
  image,
  stack,
  link,
  github,
}: ProjectCardProps) {
  return (
    <article className="w-full flex flex-col gap-4">
      <header className="flex items-center gap-4">
        <h2 className="text-[clamp(1.2rem,2vw,1.5rem)] font-medium">{title}</h2>
        {link && (
          <ExternalLink href={link}>
            <RiExternalLinkLine className="size-5" />
          </ExternalLink>
        )}
        {github && (
          <ExternalLink href={github}>
            <RiGithubLine className="size-5" />
          </ExternalLink>
        )}
      </header>

      <img src={image} alt={title} className="w-full rounded-md" />

      <div className="text-[clamp(0.8rem,2vw,1rem)]">{description}</div>

      <ul className="flex flex-wrap gap-2">
        {stack.map((tech) => (
          <li
            key={tech}
            className="text-[clamp(0.6rem,2vw,0.8rem)] border border-gray-300 rounded-md px-2 py-1"
          >
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}
