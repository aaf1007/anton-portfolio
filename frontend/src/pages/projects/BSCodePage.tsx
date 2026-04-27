import {
  BackLink,
  Beat,
  Bridge,
  Card,
  Feature,
  Hero,
  ImpactList,
  Intro,
  Lede,
  Reflection,
  Section,
} from "@/components/case-study/CaseStudy";

export default function BSCodePage() {
  return (
    <div className="max-w-[740px] mx-auto pb-24">
      <Hero
        src="/bscode.png"
        alt="BSCode editor with AI chat panel and brain rot video tab"
      />

      <Intro
        meta={[
          { label: "Timeline", value: "March 2026 — 36 hours" },
          { label: "Role", value: "Team of 4 — frontend + AI" },
          { label: "Stack", value: "Next.js, Monaco, Gemini, Tailwind" },
          { label: "Recognition", value: "🏆 Won SFU Surge SillyHacks 2026" },
        ]}
      >
        <Lede>
          A web-based code editor built around the world's worst (and most
          honest) value proposition — keep coding, even when your brain
          doesn't want to.
        </Lede>
        <p>
          BSCode is a Monaco-powered editor with an integrated Gemini chat
          panel, a Brain Rot video tab, and a Subway Surfers split-screen —
          built in 36 hours and submitted to the SillyHacks "make something
          stupid on purpose" track.
        </p>
        <p>
          The joke is the product. The product is also a working editor.
          That tension is what made it land.
        </p>
        <p>
          Try it{" "}
          <a
            href="https://bscode-alpha.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            live →
          </a>
        </p>
      </Intro>

      <Section
        eyebrow="THE PREMISE"
        heading="What if the editor took your attention seriously?"
      >
        <div className="space-y-10">
          <Beat
            title="The rot is already happening"
            body="Most of us already context-switch between code and TikTok every 90 seconds. Pretending we don't is the lie. We wanted an editor that admitted it — and turned the dopamine pipeline into a feature instead of a leak."
          />
          <Beat
            title="A silly hack with real surface area"
            body="SillyHacks rewards commitment to the bit. But to actually win, the bit has to work. We had to build a real editor (Monaco), real AI (Gemini), and real distractions — and make all three feel like one product, not three iframes in a trench coat."
          />
        </div>
      </Section>

      <Section eyebrow="FIRST 6 HOURS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="V0: Monaco + iframe">
            <p>
              We dropped Monaco into a Next.js page and embedded a YouTube
              iframe next to it. Functional, but it felt like two tabs glued
              together — the bit didn't read.
            </p>
          </Card>
          <Card title="What was missing" tone="muted">
            <p>
              The "brain rot" needed to feel native to the editor — not a
              browser tab. Same with the AI: a chat sidebar wasn't enough.
              Everything had to share one keyboard, one focus model, one vibe.
            </p>
          </Card>
        </div>
      </Section>

      <Section eyebrow="WHAT WE BUILT" heading="Three panels, one editor">
        <Feature
          number={1}
          title="Monaco at the core"
          body="The same engine that powers VS Code, dropped into the browser with syntax highlighting, multi-cursor, and a file tree. We kept the keyboard shortcuts familiar so anyone who's used VS Code feels at home — which makes the rest of the gag funnier."
          image="/bscode.png"
          alt="Monaco editor in BSCode"
        />

        <Bridge>
          A code editor without an AI in 2026 is basically Notepad.
        </Bridge>

        <Feature
          number={2}
          title="Gemini chat with file context"
          body="The chat panel automatically pipes the active file into Gemini's context, so you can ask 'why is this broken' or 'rewrite this in TypeScript' without copy-pasting. It's the only part of BSCode that's unironically useful."
          image="/bscode.png"
          alt="Gemini chat panel"
          reverse
        />

        <Bridge>And the part that made the demo pop —</Bridge>

        <Feature
          number={3}
          title="Brain Rot tab + Subway Surfers"
          body="A dedicated panel for autoplaying short-form video and a Subway Surfers split-screen running in real time. The judges laughed, then realized we'd actually wired them up as first-class panels with their own keyboard shortcut. That was the win."
          image="/bscode.png"
          alt="Brain rot video and Subway Surfers panels"
        />
      </Section>

      <Section eyebrow="REFLECTIONS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reflection title="Commit harder than feels reasonable">
            The pitch we almost made was 'a fun coding environment.' The pitch
            that won was 'the editor for people who can't focus.' Halfway-funny
            doesn't survive a 2-minute demo — full commitment to the bit does.
          </Reflection>
          <Reflection title="Polish wins jokes">
            We spent the last 4 hours on transitions, panel resizing, and a
            real landing page — not new features. The judges remembered the
            polish more than the feature list.
          </Reflection>
        </div>
      </Section>

      <Section eyebrow="WHAT'S NEXT">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <Reflection title="Real file persistence">
            Files currently live in localStorage. Adding GitHub gist sync would
            make BSCode usable for actual scratchpad work, not just demos.
          </Reflection>
          <Reflection title="Custom rot feeds">
            Let users plug in their own short-form sources — TikTok, Reels,
            X — so the rot is personalized. The joke gets sharper the more
            tailored it is.
          </Reflection>
          <Reflection title="Focus mode (ironically)">
            A toggle that hides the rot panels and turns BSCode into a clean
            editor. The premise becomes funnier when the user can opt out of
            it — and stays.
          </Reflection>
          <Reflection title="Multiplayer">
            Two cursors, one editor, shared rot feed. Pair programming with
            built-in distraction is somehow exactly the product.
          </Reflection>
        </div>
      </Section>

      <Section eyebrow="IMPACT">
        <ImpactList
          items={[
            "🏆 Won the SillyHacks 2026 track at SFU Surge.",
            "Shipped a working web IDE in 36 hours with three integrated panels.",
            "Demonstrated that a clear premise + polish beats a long feature list.",
            "Built a reusable pattern for embedding LLM context inside Monaco.",
          ]}
        />
      </Section>

      <BackLink />
    </div>
  );
}
