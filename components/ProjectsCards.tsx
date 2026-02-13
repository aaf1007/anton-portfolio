import { div, title } from "motion/react-client";
import { RiExternalLinkLine, RiGithubLine } from "react-icons/ri";

type ProjectCardProps = {
    title: string;
    description: string;
    image: string;
    stack: string[];
    link: string;
    github: string;
  };
  
  export default function ProjectsCards({
    title,
    description,
    image,
    stack,
    link,
    github,
  }: ProjectCardProps) {
    return (
      <div className="w-[80%] flex flex-col gap-4">
        <div className="md:w-[50%] flex md:items-center md:gap-4 items-center justify-between md:flex-row md:justify-start">
            {/* The thing you hover over */}
            <h1 className="text-[clamp(1.2rem,2vw,1.5rem)]">
                {title}
            </h1>
            {link==="" ? null : <a href={link} target="_blank" rel="noreferrer">
              <RiExternalLinkLine className="w-[20px] h-[20px] hover:cursor-pointer" />
            </a>}
            {github==="" ? null : <a href={github} target="_blank" rel="noreferrer">
              <RiGithubLine className="w-[20px] h-[20px] hover:cursor-pointer" />
            </a>}
        </div>
        <img src={image} alt={title} />
        <p className="text-[clamp(0.8rem,2vw,1rem)] pt-2">{description}</p>
        <ul className="flex flex-wrap gap-3">
            {stack.map((item) => (
                <li key={item} className="text-[clamp(0.6rem,2vw,0.8rem)] border border-gray-300 rounded-md px-2 py-1">{item}</li>
            ))}
        </ul>
        <hr className="my-4 border-t border-neutral-800" />
      </div>
    );
  }