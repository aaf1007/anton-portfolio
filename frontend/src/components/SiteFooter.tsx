import { useEffect, useState } from "react";

const clock = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Vancouver",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZoneName: "short",
});

function useVancouverTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return clock.format(now).toLowerCase();
}

export default function SiteFooter() {
  const time = useVancouverTime();
  return (
    <footer className="mx-auto w-full max-w-[1440px] px-5 pb-20 sm:px-12 sm:pb-6">
      <div className="flex flex-col gap-1.5 border-t border-rule pt-4 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Anton Florendo</p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            vancouver <span className="tabular-nums text-foreground">{time}</span>
          </span>
          <span aria-hidden>·</span>
          <span>built with react</span>
          <span aria-hidden>·</span>
          <span>hosted on vercel</span>
        </p>
      </div>
    </footer>
  );
}
