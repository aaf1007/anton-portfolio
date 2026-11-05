import { skills, type SkillCategory } from "@/data/portfolio";
import { useState, type CSSProperties } from "react";
import { Section } from "./Section";

const categories: ("All" | SkillCategory)[] = ["All", "Languages", "Frontend", "Backend", "AI / ML", "Tools"];

/** Skills as chips; a filter dims everything outside its category (the layout never jumps). */
export default function TechStack({ order }: { order?: number }) {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  return (
    <Section
      title="Tech Stack"
      order={order}
      headClass="s-head--stack"
      aside={
        <div className="s-tabs" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button key={c} type="button" className="s-tab" aria-pressed={filter === c} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
      }
    >
      <ul className="s-stack">
        {skills.map(({ name, icon: Icon, color, category }) => {
          const on = filter === "All" || filter === category;
          return (
            <li
              key={name}
              className={on ? "s-chip" : "s-chip is-dim"}
              style={color ? ({ "--brand": color } as CSSProperties) : undefined}
              aria-hidden={on ? undefined : true}
            >
              <Icon aria-hidden />
              {name}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
