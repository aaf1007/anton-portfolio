import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    title: "SFU CareerConnect",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Built an <strong>AI-powered internship matching platform</strong> using{" "}
          <strong>Gemini AI</strong> and the <strong>LinkedIn Jobs API</strong>,
          scraping live postings and ranking them against a user's SFU coursework
          and resume via a <strong>multi-phase prompt pipeline</strong>.
        </li>
      </ul>
    ),
    image: "sfucareer.png",
    stack: ["React", "Next.js", "Tailwind CSS", "Javascript", "Gemini AI", "MongoDB", "Redis", "Google OAuth"],
    link: "https://sfu-careerconnect.vercel.app",
    github: "https://github.com/aaf1007/sfu-careerconnect",
  },
  {
    title: "Statify",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Architected a <strong>full-stack music analytics dashboard</strong>{" "}
          integrating the <strong>Spotify Web API</strong> to surface top
          artists, tracks, and listening history across configurable time ranges.
        </li>
      </ul>
    ),
    image: "/statify.png",
    stack: ["React", "Next.js", "Tailwind CSS", "Javascript", "Spotify API"],
    github: "https://github.com/aaf1007/statify",
  },
];

export default function ProjectsPage() {
  return (
    <div className="pb-20">
      <h1 className="text-2xl font-semibold mb-10 text-foreground">projects</h1>
      <div className="flex flex-col gap-12">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
}
