import TopBar from "@/components/TopBar";
import "@/styles/shell.css";
import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

/** Case studies: plain paper, just the mark pinned top-left, no site nav. */
export default function ReadingLayout() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("reading");
    root.dataset.route = "projects";
    return () => root.classList.remove("reading");
  }, []);

  return (
    <div className="shell shell--reading">
      <a href="#main" className="skip-link">
        skip to content
      </a>
      <TopBar />
      <main id="main" className="main">
        <div key={pathname} className="page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
