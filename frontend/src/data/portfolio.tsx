import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa";
import {
  SiClaude,
  SiDocker,
  SiFastapi,
  SiGit,
  SiGooglegemini,
  SiLanggraph,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiScikitlearn,
  SiSpringboot,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from "react-icons/si";

export type Project = {
  title: string;
  description: ReactNode;
  shortDescription: string;
  /** card / hero image (root-relative path) */
  image?: string;
  /** a screen recording: plays over the image while the card is hovered */
  video?: string;
  stack: string[];
  live?: string;
  github?: string;
  caseStudy?: string;
  inProgress: boolean;
  dates: string;
  /** where it was made: a course, a hackathon, a client */
  context: string;
  /** small icon shown before the context */
  contextIcon?: string;
  /** a win worth flagging on the card */
  award?: string;
  /** background of the card's image well */
  tint: string;
};

export type SkillCategory = "Languages" | "Frontend" | "Backend" | "AI / ML" | "Tools";

export type Skill = {
  name: string;
  icon: IconType;
  color?: string;
  category: SkillCategory;
};

export type Experience = {
  role: string;
  logo?: string;
  org: string;
  url?: string;
  location: string;
  dates: string;
  current?: boolean;
  points: string[];
  stack: string[];
};

export const links = {
  linkedin: "https://www.linkedin.com/in/antonflorendo/",
  github: "https://github.com/aaf1007",
  resume: "/resume",
};

/**
 * The home page's header card. `banner` (a wide strip, about 1600 × 420) and
 * `avatar` (square) are root-relative paths in public/; leave either unset and
 * a placeholder shows in its place.
 */
export const profile: {
  name: string;
  short: string;
  /** cycles under the name */
  roles: string[];
  location: string;
  banner?: string;
  avatar?: string;
} = {
  name: "Anton Florendo",
  short: "Anton",
  roles: ["Software Developer", "Data Science @ SFU", "Hackathon Winner"],
  location: "Vancouver, BC",
};

/** The home page's About bullets. */
export const about: ReactNode[] = [
  <>
    I&rsquo;m a <strong>software developer</strong> drawn to the spot where web apps meet LLMs: practical AI tools you can
    actually use, from <Link to="/projects/verifai">browser extensions</Link> and{" "}
    <Link to="/projects/careerconnect">matching engines</Link> to study games built from your own notes.
  </>,
  <>
    I build with <strong>React, TypeScript, Python and Spring Boot</strong>, and I&rsquo;m now shipping as a software
    developer intern at <strong>SAP</strong>.
  </>,
  <>
    I study <strong>data science at Simon Fraser University</strong> after two years of computer science at Douglas
    College. I won SFU Surge SillyHacks 2026 with <Link to="/projects/bscode">BSCode</Link> and shipped Syllabyss at
    StormHacks 2026.
  </>,
];

export type Education = {
  school: string;
  program: string;
  url?: string;
  logo?: string;
  note?: string;
};

// newest first
export const education: Education[] = [
  {
    school: "Simon Fraser University",
    program: "Data Science",
    url: "https://www.sfu.ca/",
    logo: "/sfu-logo.svg",
    note: "Current",
  },
  {
    school: "Douglas College",
    program: "Computer Science",
    url: "https://www.douglascollege.ca/",
    logo: "/douglas-college-logo.svg",
    note: "Two years",
  },
];

// newest first; rendered in this order
export const experience: Experience[] = [
  {
    role: "Software Developer Intern",
    org: "SAP",
    logo: "/sap-logo.svg",
    url: "https://www.sap.com/",
    location: "Vancouver, BC",
    dates: "Sept 2026 – now",
    current: true,
    points: [
      "Migrating a monolithic Spring Boot app to microservices, refactoring backend logic into standalone services with their own REST endpoints.",
      "Building Vue 3 frontend features with Pinia and Vue Router, wired to the newly separated service APIs.",
      "Taking tickets from requirements through testing and deployment with PMs, DevOps and QA across Agile sprints.",
    ],
    stack: ["Spring Boot", "Vue 3", "Pinia", "REST"],
  },
];

export const skills: Skill[] = [
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6", category: "Languages" },
  { name: "Python", icon: SiPython, color: "#3776AB", category: "Languages" },
  { name: "Java", icon: FaJava, color: "#E76F00", category: "Languages" },
  { name: "React", icon: SiReact, color: "#61DAFB", category: "Frontend" },
  { name: "Swift", icon: SiSwift, color: "#F05138", category: "Languages" },
  { name: "Next.js", icon: SiNextdotjs, category: "Frontend" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4", category: "Frontend" },
  { name: "Vite", icon: SiVite, color: "#646CFF", category: "Frontend" },
  { name: "FastAPI", icon: SiFastapi, color: "#009688", category: "Backend" },
  { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E", category: "Backend" },
  { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F", category: "Backend" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1", category: "Backend" },
  { name: "Scikit", icon: SiScikitlearn, color: "#F7931E", category: "AI / ML" },
  { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C", category: "AI / ML" },
  { name: "LangGraph", icon: SiLanggraph, color: "#7FC8FF", category: "AI / ML" },
  { name: "Gemini", icon: SiGooglegemini, color: "#4796E3", category: "AI / ML" },
  { name: "Claude", icon: SiClaude, color: "#D97757", category: "AI / ML" },
  { name: "Git", icon: SiGit, color: "#F05032", category: "Tools" },
  { name: "Docker", icon: SiDocker, color: "#2496ED", category: "Tools" },
  { name: "Vercel", icon: SiVercel, category: "Tools" },
];

export const projects: Project[] = [
  {
    title: "Statify",
    shortDescription:
      "Full-stack music analytics dashboard for surfacing Spotify listening patterns across configurable time ranges.",
    description: (
      <ul className="space-y-1 pl-5 list-disc">
        <li>
          Architected a <strong>full-stack music analytics dashboard</strong>{" "}
          integrating the <strong>Spotify Web API</strong> to surface top
          artists, tracks, and listening history across configurable time
          ranges.
        </li>
      </ul>
    ),
    image: "/thumbs/statify.webp",
    stack: ["React", "Next.js", "Tailwind CSS", "Javascript", "Spotify API"],
    github: "https://github.com/aaf1007/statify",
    inProgress: false,
    dates: "2025",
    context: "Personal",
    tint: "#ebeaf2",
  },
  {
    title: "Rubik's Cube Solver",
    shortDescription:
      "Java implementation of Kociemba's two-phase algorithm — solves any valid cube in under a second, in 20–25 moves.",
    description: (
      <ul className="space-y-1 pl-5 list-disc">
        <li>
          Implemented Herbert Kociemba's{" "}
          <strong>two-phase algorithm</strong> in <strong>Java</strong> for{" "}
          <strong>CMPT 225</strong>, cutting the search space from roughly{" "}
          4.3 &times; 10<sup>19</sup> cube states down to about 10
          <sup>7</sup> + 10<sup>6</sup> by first solving into the{" "}
          <strong>G1 subgroup</strong>, then finishing with a restricted move
          set.
        </li>
        <li>
          Encoded cube state as <strong>integer coordinates</strong> (twist,
          flip, slice, and permutations) backed by precomputed{" "}
          <strong>move tables</strong>, reducing each move application during{" "}
          <strong>IDA* search</strong> to an O(1) lookup.
        </li>
        <li>
          Built admissible heuristics from <strong>pruning tables</strong>{" "}
          generated by backward BFS and <strong>nibble-packed</strong> to 4 bits
          per entry, halving memory — the solver runs in ~2 MB.
        </li>
      </ul>
    ),
    image: "/rubiks-solver.svg",
    stack: ["Java", "Kociemba Two-Phase", "IDA* Search", "Pruning Tables"],
    github: "https://github.com/aaf1007/rubiks-cube-solver-working-kociemba",
    inProgress: false,
    dates: "Dec 2025",
    context: "CMPT 225",
    tint: "#e4e3df",
  },
  {
    title: "SFU CareerConnect",
    shortDescription:
      "AI-powered internship matching platform ranking live postings against coursework and resume context.",
    description: (
      <ul className="space-y-1 pl-5 list-disc">
        <li>
          Built an <strong>AI-powered internship matching platform</strong>{" "}
          using <strong>Gemini AI</strong> and the{" "}
          <strong>LinkedIn Jobs API</strong>, scraping live postings and ranking
          them against a user's SFU coursework and resume via a{" "}
          <strong>multi-phase prompt pipeline</strong>.
        </li>
      </ul>
    ),
    image: "/thumbs/sfucareer.webp",
    video: "/careerconnect.mp4",
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
    live: "https://sfu-careerconnect.vercel.app",
    github: "https://github.com/aaf1007/sfu-careerconnect",
    caseStudy: "/projects/careerconnect",
    inProgress: false,
    dates: "Jan 2026",
    context: "Personal",
    contextIcon: "/sfu-logo.svg",
    tint: "#f4e3e1",
  },
  {
    title: "PantryPal",
    shortDescription:
      "AI-powered recipe generation app that turns available ingredients into structured meal suggestions.",
    description: (
      <ul className="space-y-1 pl-5 list-disc">
        <li>
          Built an <strong>AI-powered recipe generation app</strong> that
          transforms available ingredients into structured meal suggestions
          using <strong>Gemini AI</strong>, helping users quickly create recipes
          from what they already have on hand.
        </li>
      </ul>
    ),
    video: "https://res.cloudinary.com/dkmpatozu/video/upload/v1773298485/Loom_Cropping_-_11_March_2026_ictqqs.mp4",
    stack: ["React", "Spring Boot", "TypeScript", "Java"],
    live: "https://pantry-pal-umber.vercel.app",
    github: "https://github.com/aaf1007/PantryPal",
    inProgress: false,
    dates: "Feb 2026",
    context: "Personal",
    tint: "#f8eedf",
  },
  {
    title: "Stock Market Predictor",
    shortDescription:
      "Per-ticker ML pipeline forecasting next-day close prices, served through a FastAPI backend that caches and auto-retrains its models.",
    description: (
      <ul className="space-y-1 pl-5 list-disc">
        <li>
          Built a stock forecasting service that trains{" "}
          <strong>one regression pipeline per ticker</strong> (
          <strong>StandardScaler</strong> &rarr;{" "}
          <strong>LinearRegression</strong>) on <strong>yfinance</strong> market
          data, predicting the next-day close from price, volume, a 20-day
          moving average, and 20-day volatility, validated with{" "}
          <strong>TimeSeriesSplit</strong>.
        </li>
        <li>
          A <strong>FastAPI</strong> backend caches each trained model as a{" "}
          <strong>joblib</strong> artifact and retrains it in a background task
          whenever it is missing or more than 7 days stale, returning{" "}
          <strong>202 Accepted</strong> with a polling endpoint so clients never
          block on a cold train.
        </li>
        <li>
          Current saved models average <strong>~1.64% RMSE</strong> on next-day
          return error (AAPL 2.10%, T.TO 1.17%).
        </li>
      </ul>
    ),
    image: "/stock-predictor.svg",
    stack: ["Python", "FastAPI", "scikit-learn", "yfinance", "pandas", "joblib"],
    github: "https://github.com/aaf1007/stock-market-predictor",
    inProgress: false,
    dates: "February 2026",
    context: "Personal",
    tint: "#dfe6f2",
  },
  {
    title: "SFU MyProfessor",
    shortDescription:
      "Chrome extension that injects Rate My Professor context directly into SFU MySchedule.",
    description: (
      <ul className="space-y-1 pl-5 list-disc">
        <li>
          A <strong>Chrome extension</strong> that injects{" "}
          <strong>Rate My Professor</strong> ratings directly into the{" "}
          <strong>SFU MySchedule</strong> course schedule using a{" "}
          <strong>Manifest V3</strong> content script and background service
          worker.
        </li>
      </ul>
    ),
    image: "/thumbs/sfu-my-prof.webp",
    stack: ["Javascript", "TypeScript", "Tailwind CSS"],
    live: "https://chromewebstore.google.com/detail/agcnjhkelnjokbchcjkldkphdkdclonp",
    github: "https://github.com/aaf1007/SFU-MyProfessor",
    caseStudy: "/projects/myprofessor",
    inProgress: false,
    dates: "Mar 2026",
    context: "Chrome Web Store",
    contextIcon: "/sfu-logo.svg",
    tint: "#f6e5e5",
  },
  {
    title: "VerifAI",
    shortDescription:
      "Chrome extension and FastAPI backend for instant AI fact-checking with verdicts, confidence, and cited sources.",
    description: (
      <ul className="space-y-1 pl-5 list-disc">
        <li>
          A <strong>Chrome extension</strong> and <strong>FastAPI backend</strong>{" "}
          that lets users highlight any text on the web, right-click, and
          receive an instant <strong>AI-powered fact-check</strong> with
          verdict, confidence score, and cited sources.
        </li>
      </ul>
    ),
    image: "/thumbs/verifai-new.webp",
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
    context: "Personal",
    tint: "#e4eaf6",
  },
  {
    title: "Comparative Diagnostic System for Breast Cancer Classification",
    shortDescription:
      "Machine-learning classifier comparison for breast tumor diagnosis, tuned to prioritize recall.",
    description: (
      <ul className="space-y-1 pl-5 list-disc">
        <li>
          As part of <strong>CMPT 310</strong>, built and compared multiple{" "}
          <strong>machine learning classifiers</strong> to diagnose breast
          tumors as benign or malignant on the{" "}
          <strong>UCI Breast Cancer Wisconsin</strong> dataset.
        </li>
      </ul>
    ),
    image: "/thumbs/cmpt310.webp",
    stack: ["Python", "scikit-learn", "NumPy", "pandas", "Matplotlib", "Jupyter"],
    github: "https://github.com/kunaljoshi2/Tumor-Classifier",
    caseStudy: "/projects/tumor-classifier",
    inProgress: false,
    dates: "Jan 2026 - April 2026",
    context: "CMPT 310",
    tint: "#f7e4ea",
  },
  {
    title: "BSCode",
    shortDescription:
      "Web-based code editor with Monaco, Gemini chat, and intentionally chaotic focus tools.",
    description: (
      <ul className="space-y-1 pl-5 list-disc">
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
    image: "/thumbs/bscode.webp",
    stack: ["Next.js", "React", "Monaco Editor", "Tailwind CSS", "Google Gemini"],
    github: "https://github.com/ChakornK/bscode",
    live: "https://bscode-alpha.vercel.app/",
    caseStudy: "/projects/bscode",
    inProgress: false,
    dates: "April 2026",
    context: "SFU Surge SillyHacks 2026",
    award: "Winner",
    tint: "#e6e8ee",
  },
  {
    title: "Solar Calculator and Recommendation System",
    shortDescription:
      "MPPT solar charge controller calculator and recommendation system built for Xantrex Technology as a part of a client project for CMPT 276",
    description: (
      <ul className="space-y-1 pl-5 list-disc">
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
    image: "/thumbs/xantrex-calculator.webp",
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
    dates: "Jan 2026 - May 2026",
    context: "Client · Xantrex",
    tint: "#e2e9f1",
  },
  {
    title: "Chewws",
    shortDescription: "Native iOS, AI-powered food journal and nutrition app.",
    description: (
      <ul className="space-y-1 pl-5 list-disc">
        <li>
          Building a <strong>native iOS food and drink journal</strong> in{" "}
          <strong>SwiftUI</strong> where logging is the reward: one photo becomes
          an <strong>on-device background-removed cut-out</strong> and an
          auto-generated stamp.
        </li>
        <li>
          Each entry fills six surfaces &mdash; a calendar, a{" "}
          <strong>MapKit</strong> explore map, a postmark grid, a stamps
          passport, milestone stickers, and a polaroid wall.
        </li>
        <li>
          Runs entirely offline with no accounts or server: <strong>Vision</strong>{" "}
          for cut-outs, <strong>SwiftData</strong> and on-device files for
          storage. Currently preparing for <strong>TestFlight</strong>.
        </li>
      </ul>
    ),
    image: "/thumbs/chewws.webp",
    stack: [
      "Swift",
      "SwiftUI",
      "SwiftData",
      "Vision",
      "MapKit",
      "CoreLocation",
      "Python",
      "FastAPI",
      "OpenRouter"
    ],
    inProgress: true,
    dates: "June 2026 - Present",
    context: "iOS · coming soon to the App Store",
    tint: "#f9eedd",
  },
  {
    title: "Syllabyss",
    shortDescription:
      "Turns your own course notes into pixel-art study games — rarer answers sink deeper.",
    description: (
      <ul className="space-y-1 pl-5 list-disc">
        <li>
          Built a <strong>Next.js</strong> app that turns uploaded slides,
          notes, and readings into study games with{" "}
          <strong>Gemini structured output</strong>, citing the source page for
          every answer and running a second pass to drop unsupported ones.
        </li>
        <li>
          Shipped <strong>six game modes</strong> from the same notes, including
          a Krillion-style dive where rarer answers score more and a{" "}
          <strong>three.js</strong> first-person arena.
        </li>
        <li>
          Created <strong>Sonar</strong>, a <strong>LangGraph</strong> study
          coach backed by a <strong>Bayesian Knowledge Tracing</strong> model
          that finds the root cause of your misses and recommends what to play
          next.
        </li>
        <li>
          Stored every guess in <strong>TimescaleDB</strong> hypertables, with
          continuous aggregates powering the leaderboards, activity heatmap,
          and a shared Daily Dive puzzle.
        </li>
      </ul>
    ),
    image: "/thumbs/syllabyss.webp",
    stack: [
      "TypeScript",
      "Next.js",
      "React",
      "Tailwind CSS",
      "three.js",
      "LangGraph",
      "Gemini",
      "Claude",
      "PostgreSQL",
      "TimescaleDB",
      "Clerk",
    ],
    live: "https://syllabyss.tech",
    github: "https://github.com/aaf1007/Syllabyss",
    inProgress: false,
    dates: "Oct 2026",
    context: "StormHacks 2026",
    contextIcon: "/stormhacks.webp",
    tint: "#dce4f3",
  },
];

/**
 * Captions for the photos page, keyed by the file's name in src/assets/gallery/.
 * Optional: a photo with no entry just has no caption.
 */
export const photoCaptions: Record<string, string> = {
  "2026-06-04-late-night.jpg": "Late night, mid-build",
  "2026-06-04-udon.jpg": "Udon run",
};
