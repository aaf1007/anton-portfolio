import { ArrowLeft } from "lucide-react";
import { delay } from "@/lib/stagger";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** The banded strip between two sections. */
export const Gap = () => <div className="s-gap" aria-hidden />;

/** A home section: a serif heading row ruled off from its body. */
export function Section({
  title,
  note,
  aside,
  headClass,
  bodyClass = "s-body",
  order = 0,
  children,
}: {
  title: string;
  note?: string;
  aside?: ReactNode;
  headClass?: string;
  bodyClass?: string;
  order?: number;
  children: ReactNode;
}) {
  const id = title.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <section aria-labelledby={id} className="s-in" style={delay(order)}>
      <div className={["s-head s-rule-b", headClass].filter(Boolean).join(" ")}>
        <h2 id={id} className="s-h2">
          {title}
          {note && <span className="s-h2-note">{note}</span>}
        </h2>
        {aside}
      </div>
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

/** A subpage's top: ← HOME, then the big serif title and a line under it. */
export function PageHead({ title, lede, children }: { title: string; lede: ReactNode; children?: ReactNode }) {
  return (
    <>
      <div className="s-back s-rule-b s-in">
        <Link to="/">
          <ArrowLeft size={13} strokeWidth={2} />
          Home
        </Link>
      </div>
      <Gap />
      <header className="s-page-head s-rule-b s-in" style={delay(1)}>
        <h1 className="s-h1">{title}</h1>
        <p className="s-lede">{lede}</p>
        {children}
      </header>
    </>
  );
}
