import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
const projects = [
    {
      title: "SFU CareerConnect",
      description: (
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Built an <strong>AI-powered internship matching platform</strong> using{" "}
            <strong>Gemini AI</strong> and the <strong>LinkedIn Jobs API</strong>, scraping live
            postings and ranking them against a user&apos;s SFU coursework and
            resume via a <strong>multi-phase prompt pipeline</strong>.
          </li>
          {/* <li>
            Architected a <strong>serverless REST API</strong> with <strong>Next.js App Router</strong>{" "}
            and <strong>MongoDB + Mongoose</strong>, implementing a <strong>Redis</strong> caching
            layer with 30-min TTL for sessions and 24-hour TTL for job listings.
          </li>
          <li>
            Engineered <strong>real-time streaming responses</strong> via the{" "}
            <strong>Web Streams API</strong>, enabling instant job recommendations without
            page refreshes.
          </li>
          <li>
            Implemented <strong>Google OAuth</strong> authentication and cookie-based session
            management for personalized recommendations.
          </li> */}
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
            Architected a <strong>full-stack music analytics dashboard</strong> integrating
            the <strong>Spotify Web API</strong> to surface top artists, tracks, and
            listening history across configurable time ranges.
          </li>
          {/* <li>
            Implemented <strong>OAuth 2.0 PKCE authentication</strong> with automatic{" "}
            <strong>token refresh</strong> and browser-local persistence.
          </li>
          <li>
            Built a <strong>playlist export pipeline</strong> batching up to 100 Spotify
            track URIs per <strong>RESTful API</strong> call for end-to-end{" "}
            <strong>playlist creation</strong>.
          </li> */}
        </ul>
      ),
      image: "/statify.png",
      stack: ["React", "Next.js", "Tailwind CSS", "Javascript", "Spotify API"],
      github: "https://github.com/aaf1007/statify",
    },
  ];


export default function ProjectsPage() {
    return (
        <div className="h-full mb-10">
            <p className="text-[1.5rem] md:text-[2rem] text-primary/70 font-semibold mb-4 md:mb-6">Projects</p>
            <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
                {projects.map((project) => (
                    <ProjectCard key={project.title} {...project} />
                ))}
            </div>
        </div>
    )
}