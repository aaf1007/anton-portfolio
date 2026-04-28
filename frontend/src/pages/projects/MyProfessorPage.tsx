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

export default function MyProfessorPage() {
  return (
    <div className="max-w-[740px] mx-auto pb-24">
      <Hero
        src="/sfu-my-prof.png"
        alt="SFU MySchedule with professor ratings injected next to each course"
      />

      <Intro
        meta={[
          { label: "Timeline", value: "March 2026 – ongoing" },
          { label: "Role", value: "Solo — extension + scraping" },
          { label: "Stack", value: "TypeScript, MV3, Tailwind" },
          { label: "Status", value: "Live on Chrome Web Store" },
        ]}
      >
        <Lede>
          A Chrome extension that injects Rate My Professor scores directly
          into SFU's course schedule — so you stop tab-switching during
          enrollment week.
        </Lede>
        <p>
          SFU MyProfessor reads the professor names rendered on
          go.sfu.ca/myschedule and overlays each row with the average rating,
          difficulty, and would-take-again percentage from RMP. No copy-paste,
          no second tab — just a number where you need it.
        </p>
        <p>
          The whole thing is small on purpose: one Manifest V3 content script,
          one background service worker, one tiny problem solved well.
        </p>
        <p>
          Install from the{" "}
          <a
            href="https://chromewebstore.google.com/detail/agcnjhkelnjokbchcjkldkphdkdclonp?utm_source=item-share-cb"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Chrome Web Store →
          </a>
        </p>
      </Intro>

      <Section
        eyebrow="THE USER JOURNEY"
        heading="Why does enrollment feel like a research project?"
      >
        <div className="space-y-10">
          <Beat
            title="Three tabs, one decision"
            body="Picking a section meant juggling SFU MySchedule, Rate My Professor, and a spreadsheet — typing each professor's name into a search bar, copying the number back. Multiply by five courses and the friction starts to make people pick by time slot instead of teaching quality."
          />
          <Beat
            title="The data exists; it's just in the wrong place"
            body="RMP already has the answer. SFU MySchedule already shows the question. The whole problem is they don't talk to each other — and a content script is the cheapest possible bridge."
          />
        </div>
      </Section>

      <Section eyebrow="FIRST ATTEMPT">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Naive name lookup">
            <p>
              The first prototype scraped the professor name and hit RMP's
              search endpoint directly from the content script. It worked for
              "Toby Donaldson" and broke for "T. Donaldson," "Donaldson, Toby,"
              and anyone with a middle initial.
            </p>
          </Card>
          <Card title="What I missed" tone="muted">
            <p>
              Real-world name normalization is messier than expected. Rate My
              Professor is a public-facing search, not an API — fuzziness was
              the actual product, not a bug to fix in one shot.
            </p>
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="WHAT MADE IT WORK"
        heading="Bridge the two pages, don't replace them"
      >
        <Feature
          number={1}
          title="MV3 content script with name normalization"
          body="The content script reads each row in MySchedule, strips honorifics and trailing initials, and queries RMP's search through the background service worker. Multiple name variants are tried in priority order, with the first confident match cached locally."
          image="/sfu-my-prof.png"
          alt="Course schedule rows with injected RMP ratings"
        />

        <Bridge>Speed matters more than ranking — students scan, not read.</Bridge>

        <Feature
          number={2}
          title="Inline badges, not popups"
          body="Ratings render as small Tailwind-styled badges next to the professor name — average score, difficulty, and would-take-again — colored by threshold so good and bad sections are visually obvious at a glance. No hover, no click, no flow break."
          image="/sfu-my-prof.png"
          alt="Inline rating badges on each course row"
          reverse
        />

        <Bridge>And to keep it polite to RMP's servers —</Bridge>

        <Feature
          number={3}
          title="Background worker + per-name cache"
          body="The service worker dedupes lookups across tabs, caches results per normalized name, and respects sensible request rates. Reloading a schedule doesn't re-query RMP — and a quiet extension is a long-lived extension."
          image="/sfu-my-prof.png"
          alt="Background service worker handling cached lookups"
        />
      </Section>

      <Section eyebrow="REFLECTIONS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reflection title="Small extensions are good design exercises">
            There's no room to hide behind features. The whole product is one
            interaction — name in, rating out — and every decision (badge
            placement, color thresholds, cache TTL) is visible to the user.
            That constraint forces clearer thinking than a bigger app would.
          </Reflection>
          <Reflection title="Scraping is a UX problem">
            The technical work was easy; the UX work was making sure the
            extension never broke MySchedule's existing flow. A content script
            that throws errors into the page is worse than no extension at
            all.
          </Reflection>
        </div>
      </Section>

      <Section eyebrow="NEXT STEPS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <Reflection title="Comment summaries">
            Run RMP's free-text reviews through a small LLM to surface a
            one-line summary per professor — so students get tone, not just a
            number.
          </Reflection>
          <Reflection title="Section comparison view">
            A small panel that lets you select two sections of the same course
            and compare professor ratings side-by-side, instead of eyeballing
            badges.
          </Reflection>
          <Reflection title="Cross-school support">
            The MySchedule selectors are SFU-specific, but the RMP layer is
            generic. UBC and UVic versions are mostly a templating exercise.
          </Reflection>
          <Reflection title="Opt-in telemetry">
            Optional anonymized counts on which courses get the most
            extension-driven lookups — useful for prioritizing future
            enrollment-week features.
          </Reflection>
        </div>
      </Section>

      <Section eyebrow="IMPACT">
        <ImpactList
          items={[
            "Cuts a multi-tab enrollment workflow into a single page.",
            "Reaches SFU students directly via the Chrome Web Store.",
            "Demonstrates the smallest viable Manifest V3 + service worker pattern.",
            "Sets a template that generalizes to other universities with minimal change.",
          ]}
        />
      </Section>

      <BackLink />
    </div>
  );
}
