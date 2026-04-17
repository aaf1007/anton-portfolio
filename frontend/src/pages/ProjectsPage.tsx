import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    title: "Statify",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Architected a <strong>full-stack music analytics dashboard</strong>{" "}
          integrating the <strong>Spotify Web API</strong> to surface top
          artists, tracks, and listening history across configurable time
          ranges.
        </li>
      </ul>
    ),
    image: "/statify.png",
    stack: ["React", "Next.js", "Tailwind CSS", "Javascript", "Spotify API"],
    github: "https://github.com/aaf1007/statify",
    inProgress: false,
  },
  {
    title: "SFU CareerConnect",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Built an <strong>AI-powered internship matching platform</strong>{" "}
          using <strong>Gemini AI</strong> and the{" "}
          <strong>LinkedIn Jobs API</strong>, scraping live postings and ranking
          them against a user's SFU coursework and resume via a{" "}
          <strong>multi-phase prompt pipeline</strong>.
        </li>
      </ul>
    ),
    image: "sfucareer.png",
    stack: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Javascript",
      "Gemini AI",
      "MongoDB",
      "Redis",
      "Google OAuth",
    ],
    link: "https://sfu-careerconnect.vercel.app",
    github: "https://github.com/aaf1007/sfu-careerconnect",
    inProgress: false,
  },
  {
    title: "PantryPal",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Built an <strong>AI-powered recipe generation app</strong> that
          transforms available ingredients into structured meal suggestions
          using <strong>Gemini AI</strong>, helping users quickly create recipes
          from what they already have on hand.
        </li>
      </ul>
    ),
    image: (
      <video
        src="https://res.cloudinary.com/dkmpatozu/video/upload/v1773298485/Loom_Cropping_-_11_March_2026_ictqqs.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    ),
    stack: ["React", "SpringBoot", "TypeScript", "Java"],
    link: "https://pantry-pal-umber.vercel.app",
    github: "https://github.com/aaf1007/PantryPal",
    inProgress: true,
  },
  {
    title: "SFU MyProfessor",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          A <strong>Chrome extension</strong> that injects
          <strong>Rate My Professor</strong> ratings — average score,
          difficulty, and would-take-again percentage — directly into the{" "}
          <strong>SFU MySchedule</strong> course schedule using a
          <strong>Manifest V3</strong> content script and background service
          worker.
        </li>
      </ul>
    ),
    image: <img src="my-professor.png" alt="" />,
    stack: ["Javascript", "TypeScript", "Tailwindcss"],
    github: "https://github.com/aaf1007/SFU-MyProfessor",
    inProgress: true,
  },
  {                                          
    title: "VerifAI",
    description: (                                                                    
      <ul className="list-disc pl-5 space-y-1">
        <li>                                                                          
          A <strong>Chrome extension</strong> and <strong>FastAPI backend</strong>                                               that lets users highlight any text on the web, right-click, and receive
          an instant <strong>AI-powered fact-check</strong> with verdict,             
          confidence score, and cited sources.                                        
        </li>                                                                         
        <li>                                                                          
          Claims are extracted via <strong>Groq</strong> and verified using{" "}
          <strong>Gemini Search Grounding</strong>, with results streamed back to     
          an interactive <strong>React popup</strong> featuring a history tab and     
          contextual chatbot.                                                         
        </li>                                                                         
      </ul>                                                                           
    ),                                                                                
    image: <img src="verifai.png" alt="" />,         
    stack: ["TypeScript", "React", "Python", "FastAPI", "WXT", "Tailwind CSS", "Groq",       
  "Gemini"],
    github: "https://github.com/aaf1007/verifai",                                     
    inProgress: true,                                                                 
  },
  {
    title: "BSCode",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          A <strong>web-based code editor</strong> built with{" "}
          <strong>Next.js</strong> and <strong>Monaco Editor</strong> — the
          same engine that powers VS Code — featuring an integrated{" "}
          <strong>AI chat</strong> panel powered by{" "}
          <strong>Google Gemini</strong>, a built-in{" "}
          <strong>Brain Rot video</strong> tab, and{" "}
          <strong>Subway Surfers</strong> to keep you focused while you code.
        </li>
        <li>
          Won at{" "}
          <strong>SFU Surge SillyHacks 2026</strong>.
        </li>
      </ul>
    ),
    image: <img src="bscode.png" alt="" />,
    stack: ["Next.js", "React", "Monaco Editor", "Tailwind CSS", "Google Gemini"],
    github: "https://github.com/ant1007/bscode",
    inProgress: false,
  },
];

export default function ProjectsPage() {
  return (
    <div className="max-w-[740px] mx-auto pb-20">
      <h1 className="text-2xl font-semibold mb-10 text-foreground">projects</h1>
      <div className="flex flex-col gap-12">
        {[...projects].reverse().map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
}
