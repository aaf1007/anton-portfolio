import ProjectCard, { type ProjectCardProps } from "./ProjectsCards";

const B = ({ children }: { children: React.ReactNode }) => (
  <span className="font-semibold">{children}</span>
);

const projects: ProjectCardProps[] = [
  {
    title: "SFU CareerConnect",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Built an <B>AI-powered internship matching platform</B> using{" "}
          <B>Gemini AI</B> and the <B>LinkedIn Jobs API</B>, scraping live
          postings and ranking them against a user&apos;s SFU coursework and
          resume via a <B>multi-phase prompt pipeline</B>.
        </li>
        <li>
          Architected a <B>serverless REST API</B> with <B>Next.js App Router</B>{" "}
          and <B>MongoDB + Mongoose</B>, implementing a <B>Redis</B> caching
          layer with 30-min TTL for sessions and 24-hour TTL for job listings.
        </li>
        <li>
          Engineered <B>real-time streaming responses</B> via the{" "}
          <B>Web Streams API</B>, enabling instant job recommendations without
          page refreshes.
        </li>
        <li>
          Implemented <B>Google OAuth</B> authentication and cookie-based session
          management for personalized recommendations.
        </li>
      </ul>
    ),
    image: "/sfucareer.png",
    stack: ["React", "Next.js", "Tailwind CSS", "Javascript", "Gemini AI", "MongoDB", "Redis", "Google OAuth"],
    link: "https://sfu-careerconnect.vercel.app",
    github: "https://github.com/aaf1007/sfu-careerconnect",
  },
  {
    title: "Statify",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Architected a <B>full-stack music analytics dashboard</B> integrating
          the <B>Spotify Web API</B> to surface top artists, tracks, and
          listening history across configurable time ranges.
        </li>
        <li>
          Implemented <B>OAuth 2.0 PKCE authentication</B> with automatic{" "}
          <B>token refresh</B> and browser-local persistence.
        </li>
        <li>
          Built a <B>playlist export pipeline</B> batching up to 100 Spotify
          track URIs per <B>RESTful API</B> call for end-to-end{" "}
          <B>playlist creation</B>.
        </li>
      </ul>
    ),
    image: "/statify.png",
    stack: ["React", "Next.js", "Tailwind CSS", "Javascript", "Spotify API"],
    github: "https://github.com/aaf1007/statify",
  },
];

export default function Projects() {
  return (
    <div className="flex justify-center px-6 md:px-10" id="projects">
      <section className="w-full max-w-5xl">
        <h1 className="landing-section-header pb-4">Projects</h1>
        <div className="flex flex-col gap-12">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>
    </div>
  );
}
