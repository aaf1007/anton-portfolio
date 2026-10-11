import { Label, PageTitle, Reveal } from "@/components/Typography";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** Back button, the project's name as a page title, and its lead image. */
export function Hero({
  src,
  alt,
  title,
  tone = "default",
}: {
  src: string;
  alt: string;
  title: string;
  tone?: "default" | "dark";
}) {
  return (
    <header className="mb-16 flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <Link
          to="/projects"
          aria-label="Back to work"
          className="flex size-8 items-center justify-center rounded-full border border-rule text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          ←
        </Link>
        <PageTitle>{title}</PageTitle>
      </div>
      <Reveal delay={0.3}>
        <div
          className={
            "overflow-hidden rounded-[8px] border border-rule " +
            (tone === "dark" ? "bg-[#111]" : "bg-muted")
          }
        >
          <img src={src} alt={alt} className="h-auto w-full" />
        </div>
      </Reveal>
    </header>
  );
}

/** Key facts in the left column, the pitch on the right. */
export function Intro({
  meta,
  children,
}: {
  meta: { label: string; value: string }[];
  children: ReactNode;
}) {
  return (
    <Reveal className="mb-24 grid gap-x-12 gap-y-10 lg:grid-cols-3">
      <dl className="grid h-fit grid-cols-[6.5rem_1fr] gap-x-4 gap-y-3 border-t border-rule pt-4">
        {meta.map((m) => (
          <div key={m.label} className="contents">
            <dt className="text-muted-foreground lowercase">{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>
      <div className="max-w-[64ch] space-y-4 leading-relaxed text-foreground/85 lg:col-span-2">
        {children}
      </div>
    </Reveal>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className="heading text-xl text-foreground sm:text-2xl">{children}</p>;
}

/** A chapter: label and heading pinned on the left, content on the right. */
export function Section({
  eyebrow,
  heading,
  children,
}: {
  eyebrow: string;
  heading?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-24 grid gap-x-12 gap-y-8 lg:grid-cols-3">
      <div className="lg:sticky lg:top-12 lg:self-start">
        <Label>{eyebrow}</Label>
        {heading && <h2 className="heading max-w-[22ch] text-2xl text-foreground">{heading}</h2>}
      </div>
      <Reveal className="lg:col-span-2">{children}</Reveal>
    </section>
  );
}

export function Beat({
  title,
  body,
  glyph = "✦",
}: {
  title: string;
  body: ReactNode;
  glyph?: string;
}) {
  return (
    <div className="grid grid-cols-[3rem_1fr] items-start gap-5">
      <div className="flex aspect-square items-center justify-center rounded-[6px] border border-rule text-lg text-signal">
        {glyph}
      </div>
      <div>
        <h3 className="heading mb-1.5 text-base text-foreground">{title}</h3>
        <p className="max-w-[62ch] leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

export function Card({
  title,
  tone = "default",
  children,
}: {
  title: string;
  tone?: "default" | "muted";
  children: ReactNode;
}) {
  return (
    <div
      className={
        "rounded-[8px] border p-6 " + (tone === "muted" ? "border-transparent bg-muted" : "border-rule bg-panel")
      }
    >
      <h3 className="heading mb-2 text-base text-foreground">{title}</h3>
      <div className="leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export function Feature({
  number,
  title,
  body,
  image,
  alt,
  reverse = false,
}: {
  number: number;
  title: string;
  body: ReactNode;
  image: string;
  alt: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={
        "mb-14 grid grid-cols-1 items-center gap-8 md:grid-cols-2 " +
        (reverse ? "md:[&>*:first-child]:order-2" : "")
      }
    >
      <div className="overflow-hidden rounded-[8px] border border-rule bg-muted">
        <img src={image} alt={alt} className="h-auto w-full" />
      </div>
      <div>
        <p className="mb-2 text-[11px] text-signal tabular-nums">feature {String(number).padStart(2, "0")}</p>
        <h3 className="heading mb-2 text-lg text-foreground">{title}</h3>
        <p className="leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

export function Bridge({ children }: { children: ReactNode }) {
  return (
    <p className="my-12 flex max-w-[56ch] gap-3 text-muted-foreground">
      <span aria-hidden className="text-signal">
        //
      </span>
      <span>{children}</span>
    </p>
  );
}

export function Reflection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-rule pt-4">
      <h3 className="heading mb-2 text-base text-foreground">{title}</h3>
      <p className="leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

export function ImpactList({ items }: { items: string[] }) {
  return (
    <ul className="border-t border-rule">
      {items.map((item, i) => (
        <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-rule py-3">
          <span className="text-[11px] text-faint tabular-nums">{String(i + 1).padStart(2, "0")}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function BackLink() {
  return (
    <div className="mt-10 border-t border-rule pt-4">
      <Link to="/projects" className="link text-muted-foreground">
        ← back to all work
      </Link>
    </div>
  );
}
