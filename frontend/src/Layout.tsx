import Nav from "@/components/site/Nav";
import { profile } from "@/data/portfolio";
import "@/styles/site.css";
import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

/**
 * The site shell: a sticky nav, one dashed-rail column for the page (case
 * studies included), and the footer.
 */
export default function Layout() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    document.documentElement.dataset.route = pathname === "/" ? "home" : pathname.slice(1).split("/")[0];
  }, [pathname]);

  return (
    <div className="site">
      <a href="#main" className="s-skip">
        Skip to content
      </a>
      <div className="s-col">
        <Nav />
        <main id="main" key={pathname}>
          <Outlet />
        </main>
        <footer className="s-foot s-rule-t">
          <p>
            Designed &amp; Developed by <b>{profile.short}</b>
          </p>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
