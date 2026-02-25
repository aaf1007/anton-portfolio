
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
    const mediaClassName = "w-full h-auto rounded-sm";
    return (
        <div className="flex flex-col gap-3 md:gap-4">
            <p className="font-semibold text-[1.4rem]">{title}</p>
            <a href={link || github} target="_blank"><img src={image} alt="" className={`${mediaClassName} max-w-full object-cover
           transition-transform duration-200 ease-out
           hover:scale-102`}/></a>
            <div className="text-sm md:text-base">{description}</div>
            <div className="flex flex-wrap gap-2">
                {stack.map((cur) => (
                    <span
                        key={cur}
                        className="rounded-full bg-accent-light/20 text-accent px-3 py-1 text-[0.7rem] md:text-[0.8rem]"
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