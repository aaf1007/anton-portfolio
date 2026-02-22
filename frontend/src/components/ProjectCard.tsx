
import type { ReactNode } from "react"

type ProjectCards = {
    title: string,
    description: ReactNode,
    image?: string,
    stack: string[],
    link?: string,
    github?: string
}

export default function ProjectCard({ title, description, image, stack, link, github }: ProjectCards) {
    const mediaClassName = "w-full h-auto rounded-lg";
    return (
        <div className="flex flex-col gap-3 md:gap-4">
            <p className="font-semibold text-[1.2rem] md:text-[1.4rem]">{title}</p>
            <img src={image} alt="" className={`${mediaClassName} max-w-full`}/>
            {description}
            <div className="flex flex-wrap gap-2">
                {stack.map((cur) => (
                    <span
                        key={cur}
                        className="rounded-full bg-accent-light/20 text-accent px-3 py-1 text-sm font-medium"
                    >
                        {cur}
                    </span>
                ))}
            </div>
            <div className="flex gap-3">
                {link? <a href={link} className="text-accent-light hover:text-accent">link</a> : null}
                {github? <a href={github} className="text-accent-light hover:text-accent">github</a> : null}
            </div>
        </div>
    )
}