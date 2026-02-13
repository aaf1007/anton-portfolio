

import ProjectsCards from "./ProjectsCards";

const projects = [
  {
    title: "SFU CareerConnect",
    description:
        "CareerConnect is an AI-driven career strategist. You select your SFU courses and upload your resume, and Gemini analyzes your background to suggest roles and identify skill gaps. It also pulls live LinkedIn job openings across Vancouver and BC, then maps your strengths back to specific courses or projects so you can see exactly where your skills come from.",
    image: "/sfucareer.png",
    stack: ["React", "Next.js", "Tailwind CSS", "Javascript", "Gemini AI", "MongoDB", "Redis", "GoogleOAuth"],
    link: "https://sfu-careerconnect.vercel.app",
    github: "https://github.com/aaf1007/sfu-careerconnect",
  },
  {
    title: "Statify",
    description:
        "A Next.js dashboard that lets you connect your Spotify account (PKCE OAuth) and view personal listening stats: top tracks, top artists, and recently played items with time-range and result-count toggles, all pulled directly from Spotify’s Web API.",
    image: "/statify.png",
    stack: ["React", "Next.js", "Tailwind CSS", "Javascript", "Spotify API"],
    link: "",
    github: "https://github.com/aaf1007/statify",
  },
];  

export default function Projects() {
  return (
    <div className="flex justify-center" id="projects">
      <section className="w-[72vw]">
        <h1 className="landing-section-header pb-4">Projects</h1>
        <div className="flex flex-col items-center">
            {projects.map((project) => (
            <ProjectsCards
                key={project.title}
                title={project.title}
                description={project.description}
                image={project.image}
                stack={project.stack}
                link={project.link}
                github={project.github}
            />
            ))}
        </div>
      </section>
    </div>
  );
}