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
import type { ReactNode } from "react";

export type Project = {
  title: string;
  description: ReactNode;
  shortDescription: string;
  image?: string | ReactNode;
  stack: string[];
  link?: string;
  github?: string;
  prod?: string;
  caseStudy?: string;
  inProgress: boolean;
  dates: string;
};

export type Skill = {
  name: string;
  icon: IconType;
  color?: string;
};

export const coursework = [
  "Intro to Artificial Intelligence",
  "Intro to Software Engineering",
  "Linear Algebra",
  "Business Statistics",
];

export const hobbies = ["gym", "cooking", "eating", "coding"];

export const learning = ["FastAPI", "PyTorch", "Claude Code"];

export const digesting = [
  {
    name: "PyTorch Fundamentals",
    url: "https://www.learnpytorch.io/00_pytorch_fundamentals/",
  },
  {
    name: "RAG Made Simple",
    url: "https://www.amazon.ca/dp/B0D76734SZ?ref=ppx_yo2ov_dt_b_fed_digi_asin_title_351",
    image: "https://m.media-amazon.com/images/I/71zKbtDCWyL._SL1500_.jpg",
  },
  {
    name: "The Pragmatic Programmer",
    url: "https://www.amazon.ca/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052/ref=pd_lpo_d_sccl_1/132-1954098-3434648?pd_rd_w=TsM1m&content-id=amzn1.sym.d3f44101-6e04-446e-916c-a6ec5616982b&pf_rd_p=d3f44101-6e04-446e-916c-a6ec5616982b&pf_rd_r=JAWBGHBEZN6TJZS2N3GX&pd_rd_wg=N04GB&pd_rd_r=7838ce9c-ea90-441b-9162-4b5a2dc0666c&pd_rd_i=0135957052&psc=1",
    image: "https://m.media-amazon.com/images/I/71f1jieYHNL.jpg",
  },
  {
    name: "AI Engineering by Chip Huyen",
    url: "https://www.amazon.ca/AI-Engineering-Building-Applications-Foundation/dp/1098166302",
    image: "https://learning.oreilly.com/library/cover/9781098166298/250w/",
  },
  {
    name: "Stanford Lecture on AI Engineering",
    url: "https://x.com/RohOnChain/status/2043014662883786812?s=20",
  },
];

export const skills: Skill[] = [
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "Java", icon: FaJava, color: "#E76F00" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Vite", icon: SiVite, color: "#646CFF" },
  { name: "FastAPI", icon: SiFastapi, color: "#009688" },
  { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Scikit", icon: SiScikitlearn, color: "#F7931E" },
  { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },
  { name: "LangChain", icon: SiLangchain, color: "#1C3C3C" },
  { name: "Gemini", icon: SiGooglegemini, color: "#4796E3" },
  { name: "Claude", icon: SiClaude, color: "#D97757" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Vercel", icon: SiVercel },
];

export const projects: Project[] = [
  {
    title: "Statify",
    shortDescription:
      "Full-stack music analytics dashboard for surfacing Spotify listening patterns across configurable time ranges.",
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
    dates: "2025",
  },
  {
    title: "PantryPal",
    shortDescription:
      "AI-powered recipe generation app that turns available ingredients into structured meal suggestions.",
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
        className="h-full w-full object-cover"
      />
    ),
    stack: ["React", "Spring Boot", "TypeScript", "Java"],
    link: "https://pantry-pal-umber.vercel.app",
    github: "https://github.com/aaf1007/PantryPal",
    inProgress: false,
    dates: "Feb 2026",
  },
  {
    title: "SFU MyProfessor",
    shortDescription:
      "Chrome extension that injects Rate My Professor context directly into SFU MySchedule.",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          A <strong>Chrome extension</strong> that injects{" "}
          <strong>Rate My Professor</strong> ratings directly into the{" "}
          <strong>SFU MySchedule</strong> course schedule using a{" "}
          <strong>Manifest V3</strong> content script and background service
          worker.
        </li>
      </ul>
    ),
    image: "/sfu-my-prof.png",
    stack: ["Javascript", "TypeScript", "Tailwind CSS"],
    prod: "https://chromewebstore.google.com/detail/agcnjhkelnjokbchcjkldkphdkdclonp?utm_source=item-share-cb",
    github: "https://github.com/aaf1007/SFU-MyProfessor",
    caseStudy: "/projects/myprofessor",
    inProgress: false,
    dates: "Mar 2026",
  },
  {
    title: "SFU CareerConnect",
    shortDescription:
      "AI-powered internship matching platform ranking live postings against coursework and resume context.",
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
    image: "/sfucareer.png",
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
    caseStudy: "/projects/careerconnect",
    inProgress: false,
    dates: "Jan 2026",
  },
  {
    title: "BSCode",
    shortDescription:
      "Web-based code editor with Monaco, Gemini chat, and intentionally chaotic focus tools.",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          A <strong>web-based code editor</strong> built with{" "}
          <strong>Next.js</strong> and <strong>Monaco Editor</strong>, featuring
          an integrated <strong>AI chat</strong> panel powered by{" "}
          <strong>Google Gemini</strong>.
        </li>
        <li>
          Won at <strong>SFU Surge SillyHacks 2026</strong>.
        </li>
      </ul>
    ),
    image: "/bscode.png",
    stack: ["Next.js", "React", "Monaco Editor", "Tailwind CSS", "Google Gemini"],
    github: "https://github.com/ChakornK/bscode",
    link: "https://bscode-alpha.vercel.app/",
    caseStudy: "/projects/bscode",
    inProgress: false,
    dates: "April 2026",
  },
  {
    title: "VerifAI",
    shortDescription:
      "Chrome extension and FastAPI backend for instant AI fact-checking with verdicts, confidence, and cited sources.",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          A <strong>Chrome extension</strong> and <strong>FastAPI backend</strong>{" "}
          that lets users highlight any text on the web, right-click, and
          receive an instant <strong>AI-powered fact-check</strong> with
          verdict, confidence score, and cited sources.
        </li>
      </ul>
    ),
    image: "/verifai-new.png",
    stack: [
      "TypeScript",
      "React",
      "Python",
      "FastAPI",
      "WXT",
      "Tailwind CSS",
      "Groq",
      "Gemini",
    ],
    github: "https://github.com/aaf1007/verifai",
    caseStudy: "/projects/verifai",
    inProgress: false,
    dates: "Mar 2026",
  },
  {
    title: "Comparative Diagnostic System for Breast Cancer Classification",
    shortDescription:
      "Machine-learning classifier comparison for breast tumor diagnosis, tuned to prioritize recall.",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          As part of <strong>CMPT 310</strong>, built and compared multiple{" "}
          <strong>machine learning classifiers</strong> to diagnose breast
          tumors as benign or malignant on the{" "}
          <strong>UCI Breast Cancer Wisconsin</strong> dataset.
        </li>
      </ul>
    ),
    image: "/cmpt310.jpg",
    stack: ["Python", "scikit-learn", "NumPy", "pandas", "Matplotlib", "Jupyter"],
    github: "https://github.com/kunaljoshi2/Tumor-Classifier",
    caseStudy: "/projects/tumor-classifier",
    inProgress: false,
    dates: "Jan 2026 - April 2026",
  },
  {
    title: "Xantrex Calculator",
    shortDescription:
      "MPPT solar charge controller calculator that sizes controllers from panel specs, battery voltage, and location-based temperature correction.",
    description: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Built a <strong>client project for Xantrex</strong> that recommends
          compatible <strong>MPPT solar charge controllers</strong> using solar
          panel specifications, array configuration, battery bank voltage, and
          NEC-style temperature correction.
        </li>
        <li>
          Implemented a <strong>Spring Boot</strong> application with
          OpenWeatherMap location data, PostgreSQL-backed controller records,
          and an authenticated admin flow for maintaining controller specs.
        </li>
      </ul>
    ),
    image: "/xantrex-calculator.png",
    stack: [
      "Java",
      "Spring Boot",
      "Thymeleaf",
      "PostgreSQL",
      "Spring Security",
      "OpenWeatherMap API",
    ],
    github: "https://github.com/aaf1007/xantrex-calculator",
    inProgress: false,
    dates: "Jan 2026 - April 2026",
  },
];

export const lifePhotos = [
  "/pics/CE6AF28C-C289-46D7-9B0F-A2ED5C044787_1_105_c.jpeg",
  "/pics/5C821F67-8063-40E8-B669-C140862B3E88_1_105_c.jpeg",
  "/pics/045253D8-EFEA-4267-8B96-18CC2C75D6C6_1_105_c.jpeg",
  "/pics/0EF88007-1299-4AE3-AB79-4DFEDA5C6E5B_1_105_c.jpeg",
  "/pics/A6731119-E06D-41A8-8496-4922D9E9544B_4_5005_c.jpeg",
  "/pics/A278DBBD-0FC0-4514-A803-CD4DEB3914A0_4_5005_c.jpeg",
];
