import { FaGithubAlt, FaLinkedinIn } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle";

export default function Layout() {
  return (
    <div className="px-4 py-10 md:py-20 min-h-screen">
      <header className="max-w-[750px] mx-auto flex items-center justify-between mb-14">
        <nav className="flex items-center gap-5 text-sm text-foreground/70">
          <Link to="/" className="hover:text-foreground transition-colors">
            home
          </Link>
          <Link to="/projects" className="hover:text-foreground transition-colors">
            projects
          </Link>
          <Link to="/life">
            life
          </Link>
        </nav>
        


        {/* Social icons + theme toggle — right side */}
        <div className="flex items-center gap-3 text-foreground/60">
          <a
            href="https://github.com/aaf1007"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hover:text-foreground transition-colors"
          >
            <FaGithubAlt className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/antonflorendo/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hover:text-foreground transition-colors"
          >
            <FaLinkedinIn className="w-4 h-4" />
          </a>
          <ThemeToggle />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
