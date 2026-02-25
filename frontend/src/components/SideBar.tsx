import { Link } from "react-router-dom";
import { useState } from "react";

type SideBarProps = { onNavigate?: () => void };

export default function SideBar({ onNavigate }: SideBarProps) {
    const [current, setCurrent] = useState("");

    const handleNav = (key: string, fn?: () => void) => {
        setCurrent(key);
        onNavigate?.();
        fn?.();
    };

    return (
        <div className="flex flex-col min-h-screen md:min-h-0 w-full pl-0 md:pl-9 gap-4">
            <div className="leading-6">
                <p className="font-extrabold text-[1.4rem] text-primary hover:text-accent-light" onClick={() => handleNav("", () => document.getElementById("home")?.scrollIntoView({ behavior: "smooth", block: "start" }))}><Link to="/#home">anton florendo</Link></p>
                <p className="tracking-tight text-[0.9rem] text-primary/50">data science @ sfu</p>
            </div>
            <ul className="flex flex-col gap-2">
                <li className={`hover:text-accent-light ${current === "projects" ? "font-bold text-accent-light" : ""}`} onClick={() => handleNav("projects")}>
                    <Link to="/projects">projects</Link>
                </li>
                {/* <li className={`hover:text-accent-light ${current === "experience" ? "font-bold text-accent-light" : ""}`} onClick={() => handleNav("experience")}>
                    <Link to="/projects">experience</Link>
                </li> */}
                <li className={`hover:text-accent-light ${current === "contact" ? "font-bold text-accent-light" : ""}`} onClick={() => handleNav("contact")}>
                    <Link to="/#contact">contact</Link>
                </li>
                {/* <li className={`hover:text-accent-light ${current === "chat" ? "font-bold text-accent-light" : ""}`} onClick={() => handleNav("chat")}>
                    <Link to="/contact">chat</Link>
                </li> */}
            </ul>
        </div>
    );
}
