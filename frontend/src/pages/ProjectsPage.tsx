import { ProjectGrid } from "@/components/site/ProjectCard";
import { Gap, PageHead } from "@/components/site/Section";
import { delay } from "@/lib/stagger";
import { projects } from "@/data/portfolio";

// the data file lists projects oldest first
const latestFirst = [...projects].reverse();

export default function ProjectsPage() {
  return (
    <>
      <PageHead
        title="Projects"
        lede="Things I've built: hackathon wins, course projects, client work and late-night side projects, newest first."
      />
      <Gap />
      <div className="s-in" style={delay(2)}>
        <ProjectGrid projects={latestFirst} />
      </div>
    </>
  );
}
