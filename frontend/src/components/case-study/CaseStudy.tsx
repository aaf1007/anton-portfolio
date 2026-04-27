import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function Hero({
  src,
  alt,
  tone = "default",
}: {
  src: string;
  alt: string;
  tone?: "default" | "dark";
}) {
  return (
    <div
      className={
        "rounded-xl overflow-hidden mb-10 " +
        (tone === "dark" ? "bg-primary-dark" : "bg-tan-pastel")
      }
    >
      <img src={src} alt={alt} className="w-full h-auto" />
    </div>
  );
}

export function Intro({
  meta,
  children,
}: {
  meta: { label: string; value: string }[];
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-10 mb-20">
      <div className="space-y-4 text-foreground/80 leading-relaxed">
        {children}
      </div>
      <aside className="space-y-5 text-sm md:border-l md:border-border md:pl-6">
        {meta.map((m) => (
          <Meta key={m.label} label={m.label} value={m.value} />
        ))}
      </aside>
    </div>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className="text-foreground text-lg font-medium">{children}</p>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-foreground/50 text-xs uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-foreground/85">{value}</div>
    </div>
  );
}

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
    <section className="mb-20">
      <div className="text-center mb-10">
        <div className="text-xs tracking-[0.18em] text-foreground/50 mb-3">
          {eyebrow}
        </div>
        {heading && (
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            {heading}
          </h2>
        )}
      </div>
      {children}
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
    <div className="grid grid-cols-[80px_1fr] gap-6 items-start">
      <div className="aspect-square rounded-md bg-tan-pastel flex items-center justify-center text-foreground/30 text-2xl">
        {glyph}
      </div>
      <div>
        <h4 className="font-semibold text-foreground mb-1.5">{title}</h4>
        <p className="text-foreground/75 leading-relaxed">{body}</p>
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
        "rounded-lg p-6 border " +
        (tone === "muted"
          ? "bg-tan-pastel border-transparent"
          : "border-border")
      }
    >
      <h3 className="font-semibold text-foreground mb-2 tracking-wide">
        {title}
      </h3>
      <div className="text-sm text-foreground/75 leading-relaxed">
        {children}
      </div>
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
        "grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12 " +
        (reverse ? "md:[&>*:first-child]:order-2" : "")
      }
    >
      <div className="rounded-lg overflow-hidden bg-tan-pastel border border-border">
        <img src={image} alt={alt} className="w-full h-auto" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-2">
          {title} — Feature #{number}
        </h3>
        <p className="text-foreground/75 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

export function Bridge({ children }: { children: ReactNode }) {
  return (
    <p className="text-center text-foreground/60 italic my-10 max-w-md mx-auto">
      {children}
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
    <div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-foreground/75 leading-relaxed text-[0.95rem]">
        {children}
      </p>
    </div>
  );
}

export function ImpactList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-foreground/80 list-disc pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function BackLink() {
  return (
    <div className="mt-20 text-sm text-foreground/60">
      <Link to="/projects" className="hover:text-foreground transition-colors">
        ← back to projects
      </Link>
    </div>
  );
}
