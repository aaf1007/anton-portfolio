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

export default function VerifAIPage() {
  return (
    <div className="max-w-[740px] mx-auto pb-24">
      <Hero
        src="/verifai-new.png"
        alt="VerifAI sidepanel showing a fact-check verdict with cited sources"
      />

      <Intro
        meta={[
          { label: "Timeline", value: "March 2026 – ongoing" },
          { label: "Role", value: "Solo — full stack" },
          { label: "Stack", value: "React, WXT, FastAPI, Groq, Gemini" },
          { label: "Status", value: "In progress" },
        ]}
      >
        <Lede>
          A right-click fact-checker for the open web — highlight any claim,
          get a verdict, confidence score, and cited sources in seconds.
        </Lede>
        <p>
          VerifAI is a Chrome extension and FastAPI backend that turns the
          messy chore of "is this actually true?" into a single contextual
          action. Claims are extracted with Groq, verified with Gemini Search
          Grounding, and streamed back to a sidepanel with a history tab and
          follow-up chatbot.
        </p>
        <p>
          The goal: collapse the gap between reading something suspicious and
          knowing whether to trust it — without leaving the page.
        </p>
        <p>
          Curious?{" "}
          <a
            href="https://github.com/aaf1007/verifai"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            See it on GitHub →
          </a>
        </p>
      </Intro>

      <Section
        eyebrow="THE USER JOURNEY"
        heading="Why does fact-checking feel like a chore?"
      >
        <div className="space-y-10">
          <Beat
            title="Context-switching tax"
            body="Every time I saw a dubious claim — a stat in a tweet, a confident sentence in a blog post — verifying it meant opening three tabs, copying text, and skimming sources. By the time I had an answer, I'd usually lost the thread of what I was reading."
          />
          <Beat
            title="Trust without traceability"
            body="Generic chatbots could answer 'is this true?' but rarely cited where the answer came from. A verdict without a source is just a vibe — and that's worse than no verdict at all."
          />
        </div>
      </Section>

      <Section eyebrow="FIRST SOLUTION">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="A bookmarklet">
            <p>
              I started with a one-line bookmarklet that POSTed selected text
              to a local FastAPI endpoint. It worked, but it broke on most
              sites with strict CSPs, and the response had nowhere to live —
              it just dumped JSON into an alert box.
            </p>
          </Card>
          <Card title="Problems" tone="muted">
            <p>
              No persistent UI, no history, no follow-up questions. The
              verification happened in a vacuum and disappeared the moment I
              clicked away.
            </p>
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="WHY VERIFAI EXISTS"
        heading="What if the verdict lived next to the page?"
      >
        <Feature
          number={1}
          title="Right-click, verify"
          body="A Manifest V3 content script adds a 'Verify with VerifAI' option to the native context menu. Selected text is sent to the backend, claims are extracted by Groq, and the result streams back into a browser sidepanel — no tab switching, no copy-paste."
          image="/verifai-new.png"
          alt="VerifAI sidepanel rendering a streamed verdict"
        />

        <Bridge>
          The verdict alone wasn't enough — I needed to see the receipts.
        </Bridge>

        <Feature
          number={2}
          title="Grounded sources, not vibes"
          body="Verification runs through Gemini Search Grounding, which returns the live URLs the model used to reach its conclusion. Each verdict comes with a confidence score and clickable citations — so 'true' or 'false' is auditable instead of opaque."
          image="/verifai-new.png"
          alt="Citations and confidence score panel"
          reverse
        />

        <Bridge>One verdict was useful. A conversation around it was better.</Bridge>

        <Feature
          number={3}
          title="History + contextual chatbot"
          body="Every verification is saved to a history tab, and each result opens into a follow-up chat scoped to the original claim and its sources. You can ask 'where did this number come from?' or 'what's the counter-argument?' without re-pasting context."
          image="/verifai-new.png"
          alt="History tab and contextual chatbot"
        />
      </Section>

      <Section eyebrow="REFLECTIONS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reflection title="Streaming changes the feel of trust">
            Showing tokens as they arrive — instead of a 6-second spinner —
            made the verdict feel investigated rather than declared. The
            mechanics didn't change; the perception of rigor did.
          </Reflection>
          <Reflection title="Browser extensions are a UX constraint, not a checkbox">
            Manifest V3, sidepanel APIs, and CSP rules forced design decisions
            I'd otherwise have hand-waved. Working inside those constraints
            ended up sharpening the product, not limiting it.
          </Reflection>
        </div>
      </Section>

      <Section eyebrow="NEXT STEPS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <Reflection title="Per-domain trust scores">
            Aggregate verdict outcomes by source domain so users can see, over
            time, which sites tend to hold up under verification and which
            don't.
          </Reflection>
          <Reflection title="Inline annotations">
            Instead of a sidepanel, render verdict badges directly inline next
            to claims on the page — making fact-status ambient rather than
            on-demand.
          </Reflection>
          <Reflection title="Shared verdict links">
            A permalink for every verification so users can share 'here's the
            check I ran' instead of re-litigating in DMs.
          </Reflection>
          <Reflection title="Self-hosted backend">
            Package the FastAPI service as a one-command Docker setup so
            privacy-sensitive users can run verification on their own keys and
            infrastructure.
          </Reflection>
        </div>
      </Section>

      <Section eyebrow="IMPACT">
        <ImpactList
          items={[
            "Compresses a multi-tab verification flow into one right-click.",
            "Makes AI verdicts auditable through grounded, clickable sources.",
            "Turns one-off fact-checks into a searchable personal history.",
            "Provides a reusable pattern for browser-native LLM tooling.",
          ]}
        />
      </Section>

      <BackLink />
    </div>
  );
}
