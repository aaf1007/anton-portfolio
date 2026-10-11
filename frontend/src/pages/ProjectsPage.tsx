import ProjectList from "@/components/ProjectList";
import { PageTitle, Reveal } from "@/components/Typography";
import { projects } from "@/data/portfolio";

const latestFirst = [...projects].reverse();
const caseStudies = projects.filter((p) => p.caseStudy).length;

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-14">
      <div className="grid gap-8 lg:grid-cols-3 lg:items-end">
        <PageTitle className="lg:col-span-2" aside={<span className="tabular-nums">({projects.length})</span>}>
          work
        </PageTitle>
        <Reveal delay={0.3}>
          <p className="max-w-[44ch] text-muted-foreground">
            Apps, browser extensions, ML experiments and hackathon builds, newest first.{" "}
            {caseStudies} have a written case study.
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.2}>
        <ProjectList projects={latestFirst} />
      </Reveal>
    </div>
  );
}
