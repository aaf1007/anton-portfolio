import { links } from "@/data/portfolio";
import { go } from "@/lib/go";
import Logo from "./Logo";
import { useLocation } from "react-router-dom";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function TopBar() {
  // case studies keep just the mark, like a reading view
  const reading = /^\/projects\/./.test(useLocation().pathname);
  return (
    <header className="top-nav">
      <a
        href="/"
        className="nav-left"
        aria-label="Anton Florendo — home"
        onClick={(e) => {
          e.preventDefault();
          go("/");
        }}
      >
        <Logo className="nav-logo" />
        {!reading && (
          <span className="nav-identity">
            <span className="nav-name">Anton Florendo</span>
          </span>
        )}
      </a>
      {!reading && (
        <nav aria-label="Elsewhere" className="nav-right">
          <a href={links.linkedin} {...ext} className="nav-icon">
            LinkedIn
          </a>
          <a href={links.github} {...ext} className="nav-icon">
            GitHub
          </a>
          <a
            href="/resume"
            className="nav-icon"
            onClick={(e) => {
              e.preventDefault();
              go("/resume");
            }}
          >
            Resume
          </a>
        </nav>
      )}
    </header>
  );
}
