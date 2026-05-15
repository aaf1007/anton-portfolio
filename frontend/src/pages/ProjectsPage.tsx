import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/portfolio";
import { staggerContainer } from "@/lib/motion";
import { motion } from "motion/react";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-[800px] pb-28">
      <div className="mb-10 flex flex-col gap-3 text-center">
        <p className="text-sm font-medium text-muted-foreground">My Projects</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Check out my latest work
        </h1>
        <p className="mx-auto max-w-xl text-balance text-muted-foreground">
          A running collection of apps, extensions, AI experiments, and case
          studies.
        </p>
      </div>
      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        variants={staggerContainer(0.07)}
        initial="hidden"
        animate="show"
      >
        {[...projects].reverse().map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </motion.div>
    </div>
  );
}
