const links = [
  { label: "aaf13@sfu.ca", href: "mailto:aaf13@sfu.ca" },
  { label: "connect on linkedin", href: "https://www.linkedin.com/in/antonflorendo/", external: true },
  { label: "github", href: "https://github.com/aaf1007", external: true },
];

export default function Footer() {
  return (
    <div id="contact" className="pt-10 border-t border-primary/10">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4">
        {links.map(({ label, href, external }) => (
          <a
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="flex items-start gap-1 text-sm text-foreground/60 hover:text-foreground transition-colors group"
          >
            <span className="mt-px shrink-0">↗</span>
            <span>{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
