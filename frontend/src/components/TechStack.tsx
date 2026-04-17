import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa";
import {
  SiClaude,
  SiDocker,
  SiFastapi,
  SiGit,
  SiGooglegemini,
  SiLangchain,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiScikitlearn,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from "react-icons/si";

type Tech = {
  name: string;
  icon: IconType;
  color?: string;
};

type Category = {
  label: string;
  items: Tech[];
};

const categories: Category[] = [
  {
    label: "Languages",
    items: [
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "Java", icon: FaJava, color: "#E76F00" },
      { name: "SQL", icon: SiPostgresql, color: "#4169E1" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Vite", icon: SiVite, color: "#646CFF" },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "FastAPI", icon: SiFastapi, color: "#009688" },
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    ],
  },
  {
    label: "AI / ML",
    items: [
      { name: "Scikit", icon: SiScikitlearn, color: "#F7931E" },
      { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },
      { name: "LangChain", icon: SiLangchain, color: "#1C3C3C" },
      { name: "Gemini", icon: SiGooglegemini, color: "#4796E3" },
      { name: "Claude", icon: SiClaude, color: "#D97757" },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Vercel", icon: SiVercel },
    ],
  },
];

function TechStack() {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {categories.map(({ label, items }) => (
        <div key={label} className="flex gap-4 items-start flex-wrap">
          <span className="text-xs font-medium uppercase tracking-widest text-primary/40 w-20 shrink-0 pt-1.5">
            {label}
          </span>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {items.map(({ name, icon: Icon, color }) => (
              <div
                key={name}
                className="flex items-center gap-1.5 text-sm text-foreground/80"
              >
                <Icon
                  className="w-4 h-4 shrink-0"
                  style={color ? { color } : undefined}
                />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export { TechStack };
