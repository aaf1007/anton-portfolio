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

export default function CareerConnectPage() {
  return (
    <div className="max-w-[740px] mx-auto pb-24">
      <Hero
        src="/sfucareer.png"
        alt="SFU CareerConnect dashboard showing ranked internship matches"
      />

      <Intro
        meta={[
          { label: "Timeline", value: "Sep 2025 – Jan 2026" },
          { label: "Role", value: "Solo — full stack + AI" },
          { label: "Stack", value: "Next.js, Gemini, MongoDB, Redis" },
          { label: "Status", value: "Shipped" },
        ]}
      >
        <Lede>
          An AI-powered internship matcher that ranks live job postings
          against your actual SFU coursework and resume — so you stop applying
          to roles you'll never hear back from.
        </Lede>
        <p>
          CareerConnect scrapes LinkedIn job postings in real time, then runs
          them through a multi-phase Gemini prompt pipeline that scores each
          one against the courses you've taken and the projects on your
          resume. The output is a ranked list with the why baked in.
        </p>
        <p>
          The bet: most students aren't underqualified — they're poorly
          targeted. A better filter is more useful than a longer feed.
        </p>
        <p>
          Try it{" "}
          <a
            href="https://sfu-careerconnect.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            live →
          </a>
        </p>
      </Intro>

      <Section
        eyebrow="THE USER JOURNEY"
        heading="Why does every internship feel like a long shot?"
      >
        <div className="space-y-10">
          <Beat
            title="The 200-application year"
            body="Friends were sending out hundreds of applications and getting single-digit responses. The signal-to-noise ratio on LinkedIn job filters is low — keyword matches don't know that CMPT 225 means data structures, or that 'built a full-stack app' covers a real chunk of the requirements."
          />
          <Beat
            title="Coursework is invisible to recruiters"
            body="The thing students actually have — a transcript and a few projects — is the thing recruiters can't easily parse. We needed a tool that closed that gap on the student's side, before the application even went out."
          />
        </div>
      </Section>

      <Section eyebrow="FIRST SOLUTION">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Single-shot ranking">
            <p>
              The first version stuffed the resume, course list, and 50 job
              postings into one Gemini call and asked for a ranked list. It
              worked for 5 jobs and fell apart at scale — context windows
              choked, scores drifted, explanations got generic.
            </p>
          </Card>
          <Card title="Why it broke" tone="muted">
            <p>
              Models reason worse when asked to do too much in one pass.
              Ranking 50 items against a multi-dimensional rubric needs
              structure, not just a bigger prompt.
            </p>
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="WHY CAREERCONNECT EXISTS"
        heading="What if matching was a pipeline, not a prompt?"
      >
        <Feature
          number={1}
          title="Live LinkedIn scraping"
          body="A scheduled scraper pulls fresh postings filtered to SFU-relevant roles, normalizes the title/skills/description, and writes them to MongoDB. Redis caches the parsed structure so the AI layer never re-parses the same posting twice."
          image="/sfucareer.png"
          alt="Live job postings ingested into the database"
        />

        <Bridge>Once the data was clean, the matching could get smart.</Bridge>

        <Feature
          number={2}
          title="Multi-phase prompt pipeline"
          body="Each job runs through three Gemini passes: (1) extract a structured requirement spec, (2) score it against the student's transcript and resume on five dimensions, (3) generate a one-paragraph rationale. Splitting the work made the scores stable and the explanations specific."
          image="/sfucareer.png"
          alt="Multi-phase ranking pipeline diagram"
          reverse
        />

        <Bridge>And to make it personal —</Bridge>

        <Feature
          number={3}
          title="Google OAuth + saved profiles"
          body="Students sign in with their SFU Google account, paste their resume once, and select their courses from a real SFU course catalog. The matcher remembers their profile, so every refresh is a personalized re-rank — not a from-scratch survey."
          image="/sfucareer.png"
          alt="Profile setup screen with course catalog selector"
        />
      </Section>

      <Section eyebrow="REFLECTIONS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reflection title="Pipelines beat prompts">
            The instinct with LLMs is to make the prompt smarter. The bigger
            unlock was making the prompt simpler and chaining several together.
            Each pass had one job, and the system got more reliable as a
            result.
          </Reflection>
          <Reflection title="Trust comes from rationale, not score">
            Users didn't trust a "92% match" number. They trusted "you took
            CMPT 470 and they want React + REST experience." Showing the
            reasoning was worth more than tightening the score.
          </Reflection>
        </div>
      </Section>

      <Section eyebrow="NEXT STEPS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <Reflection title="Resume-aware cover letters">
            Generate a starter cover letter per job that references both the
            posting and the user's strongest matching project — turning the
            ranking into an action, not just a feed.
          </Reflection>
          <Reflection title="Application tracker">
            Let users mark "applied / interviewing / rejected" on each ranked
            job, then learn from the outcomes — boosting the kinds of postings
            that historically convert for them.
          </Reflection>
          <Reflection title="Beyond SFU">
            The course catalog is the only SFU-specific piece. Generalizing it
            to UBC, UVic, and UW is mostly a data problem — same pipeline,
            different inputs.
          </Reflection>
          <Reflection title="Recruiter-side preview">
            Show recruiters which course outcomes a candidate's transcript
            covers, in their language. The bet on the student side could
            extend to the hiring side.
          </Reflection>
        </div>
      </Section>

      <Section eyebrow="IMPACT">
        <ImpactList
          items={[
            "Compresses a 50-tab job hunt into a single ranked feed.",
            "Makes coursework legible as a hiring signal, not just a transcript.",
            "Demonstrates a multi-phase prompt pipeline that scales past single-shot LLM calls.",
            "Provides a reusable architecture for ranking + reasoning over scraped data.",
          ]}
        />
      </Section>

      <BackLink />
    </div>
  );
}
