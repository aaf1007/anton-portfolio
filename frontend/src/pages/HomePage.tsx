import Footer from "@/components/Footer";
import { BlurFade } from "@/components/ui/blur-fade";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const coursework = [
  "Intro to Artificial Intelligence",
  "Intro to Software Engineering",
  "Linear Algebra",
  "Business Statistics",
];

const hobbies = ["gym", "cooking", "eating", "coding"];


const learning = ["springboot", "express", "machine learning"];

export default function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el =
          hash === "#contact"
            ? document.getElementById("contact")
            : hash === "#home"
            ? document.getElementById("home")
            : null;
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    return () => cancelAnimationFrame(id);
  }, [hash]);

  return (
    <div id="home" className="max-w-[750px] mx-auto flex flex-col gap-12 pb-20">
      <DottedGlowBackground
        className="md:h-40 h-20 pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-16 dark:opacity-100"
        opacity={1}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />

      {/* Hero */}
      <div className="flex justify-center items-center mt-10 flex-col gap-4">
        <HeroText />
        <div className="text-[#A6192E] flex text-sm items-center gap-2">
          <img src="https://images.seeklogo.com/logo-png/39/1/simon-fraser-clan-logo-png_seeklogo-399417.png" alt="" className="size-8"/> 
          Major in Data Science
        </div>
      </div>      

      {/* Intro */}
      <section>
        <p className="text-foreground/75 leading-relaxed">
          I'm a Data Science student at SFU who builds full-stack web apps and
          has recently gotten into AI/ML. Outside of coding I play tennis,
          basketball, and spend way too much time at the gym. I also love
          listening to music and watching movies.
        </p>
      </section>

      {/* Currently Focused On */}
      <section className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-widest text-primary/50 mb-2">
          currently...
        </p>
        <p className="text-foreground/75 leading-relaxed">
          Building full-stack applications, exploring AI/ML, and diving into
          distributed systems. I care about building things that solve real
          problems.
        </p>
        <p className="text-foreground/75">
          <span className="font-medium">Learning </span>
          {learning.join(", ")}
        </p>
      </section>

      {/* Coursework + Hobbies */}
      <section className="flex gap-14 flex-wrap">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary/50 mb-2">
            coursework
          </p>
          <ul className="space-y-1 text-foreground/75">
            {coursework.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary/50 mb-2">
            hobbies
          </p>
          <ul className="space-y-1 text-foreground/75">
            {hobbies.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tech Stack */}
      {/* <section className="w-full">
        <p className="text-xs font-medium uppercase text-pretty tracking-widest text-primary/50">
          tech stack
        </p> */}
        {/* <div className="flex gap-3 flex-wrap">
          {stack.map((name) => (
            <StackIcon key={name} name={name} className="w-9 h-9" />
          ))}
        </div> */}
        {/* <div className="w-full">
          <TechStack />
        </div>
      </section> */}

      <Footer />
    </div>
  );
}

function HeroText() {
  return (
    <section id="header" className="text-center">
    <BlurFade delay={0.25} inView>
      <h2 className="text-3xl font-medium tracking-tighter sm:text-5xl xl:text-6xl/none">
        Hi, I'm Anton 👋
      </h2>
    </BlurFade>
    <BlurFade delay={0.25 * 2} inView>
      <span className="text-2xl text-pretty text-secondary tracking-tighter sm:text-3xl xl:text-4xl/none">
        I design & develop user-friendly apps
      </span>
    </BlurFade>
  </section>
  )
}